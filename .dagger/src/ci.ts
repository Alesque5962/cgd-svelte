import {
  dag,
  Container,
  Directory,
  object,
  func,
  argument,
  Secret,
} from "@dagger.io/dagger";

@object()
export class CgdFrontend {
  @func()
  async dockerBuildPublish(
    @argument({
      defaultPath: "/",
      ignore: ["node_modules", "build"],
    })
    source: Directory,
    dockerUsername: string = "",
    dockerPassword: string = ""
  ): Promise<string> {
    /* if (dockerUsername == "" || dockerPassword == "") {
      dockerUsername = process.env.DOCKER_USERNAME;
      dockerPassword = process.env.DOCKER_USERNAME;
    } */
    let secretDockerPassword: Secret = dag.setSecret(
      "docker_password",
      dockerPassword
    );
    await this.runTests(source);
    // Stage 1: Build stage
    const builder = dag
      .container()
      .from("node:23.11.0-slim")
      .withWorkdir("/app")
      .withMountedCache("/root/.npm", dag.cacheVolume("node"))
      .withDirectory("/app", source)
      .withExec(["npm", "ci"])
      .withExec(["npm", "install", "--save-dev", "@sveltejs/adapter-static"])
      .withEnvVariable("NODE_ENV", "production")
      .withExec(["npm", "run", "build"]);

    // Stage 2: Production stage
    const build = dag
      .container()
      .from("nginx:1.29.2-alpine")
      .withDirectory("/usr/share/nginx/html", builder.directory("/app/build"))
      .withFile(
        "/etc/nginx/conf.d/default.conf",
        source.file("nginx/nginx.conf")
      )
      .withRegistryAuth("docker.io", dockerUsername, secretDockerPassword)
      .withExposedPort(80)
      .withDefaultArgs(["nginx", "-g", "daemon off;"]);

    // Publication sur DockerHub
    console.log("🚀 Publication on DockerHub...");
    const imageRef = `${dockerUsername}/cgd-frontend:latest`;
    try {
      await build.publish(imageRef);
      return `✅ Image successfully published : ${imageRef}`;
    } catch (error) {
      console.error(`❌ Error during publication: ${error}`);
      throw error;
    }
  }

  /**
   * Return the result of running unit tests
   */
  @func()
  async runTests(
    @argument({ defaultPath: "/" }) source: Directory
  ): Promise<string> {
    try {
      return this.buildEnvTests(source)
        .withExec(["npm", "run", "build"])
        .withExec(["npx", "playwright", "test"])
        .stdout();
    } catch (error) {
      console.error(`❌ Error during tests execution: ${error}`);
      throw error;
    }
  }

  /**
   * Build a ready-to-use development environment
   */
  @func()
  buildEnvTests(@argument({ defaultPath: "/" }) source: Directory): Container {
    try {
      const nodeCache = dag.cacheVolume("node");
      return (
        dag
          .container()
          .from("node:23.11.0-slim")
          .withDirectory("/src", source)
          .withMountedCache("/root/.npm", nodeCache)
          .withWorkdir("/src")
          .withExec(["npm", "install"])
          // Install Playwright browsers and browser system dependencies
          .withExec([
            "npx",
            "-y",
            "playwright@latest",
            "install",
            "--with-deps",
          ])
      );
    } catch (error) {
      console.error(`❌ Error during build environment tests: ${error}`);
      throw error;
    }
  }
}
