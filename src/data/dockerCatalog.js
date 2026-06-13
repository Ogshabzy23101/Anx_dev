const categoryUseCases = {
  "Docker basics": "understanding the daemon, client, objects, and isolation model",
  Images: "managing immutable application artifacts across environments",
  Containers: "running isolated application processes consistently",
  Dockerfile: "encoding reproducible image builds as version-controlled instructions",
  "Build context": "controlling which source files are available and transferred during builds",
  "Tags and registries": "versioning and distributing images through registries",
  Volumes: "persisting state independently of container lifecycles",
  "Bind mounts": "sharing host files with development and operational containers",
  Networks: "connecting services with isolated networking and service discovery",
  "Ports and publishing": "making container services reachable from hosts and external clients",
  "Environment variables": "injecting runtime configuration without rebuilding images",
  "Logs and debugging": "collecting evidence from container output and metadata",
  "Exec and shell access": "running diagnostic commands inside active containers",
  "Container lifecycle": "creating, stopping, restarting, and removing workloads predictably",
  "Docker Compose basics": "defining and operating multi-container applications",
  "Multi-stage builds": "separating build tools from lean runtime images",
  "Image optimization": "reducing build time, image size, and runtime attack surface",
  "Security basics": "running containers with safer identities, capabilities, and filesystems",
  Troubleshooting: "isolating image, runtime, networking, storage, and resource failures",
  "DevOps workflows": "building, testing, scanning, tagging, and publishing delivery artifacts",
};

function entry(
  category,
  difficulty,
  command,
  fullMeaning,
  basicExplanation,
  commonSyntax,
  commonFlags,
  examples,
  commonMistake,
  relatedCommands,
  answers = examples,
) {
  const professionalExplanation = `${basicExplanation} It contributes to repeatable container delivery by making runtime or build behavior explicit.`;
  return {
    category,
    difficulty,
    command,
    topic: command,
    fullMeaning,
    description: basicExplanation,
    basicExplanation,
    professionalExplanation,
    commonSyntax,
    syntax: commonSyntax,
    commonFlags,
    examples,
    devOpsUseCase: `Useful for ${categoryUseCases[category]}.`,
    commonMistake,
    relatedCommands,
    relatedConcepts: relatedCommands,
    answers,
  };
}

const rows = {
  "Docker basics": [
    ["beginner", "Docker Engine", "Docker Engine", "Provides the daemon, API, and CLI used to build and run containers.", "docker [command]", ["--context", "--host"], ["docker version"], "Treating containers as full virtual machines.", ["dockerd", "containerd"]],
    ["beginner", "docker version", "Docker version", "Shows Docker client and server version information.", "docker version [options]", ["--format"], ["docker version"], "Checking only the client version when the daemon is incompatible.", ["docker info", "docker context"]],
    ["beginner", "docker info", "Docker information", "Displays daemon configuration, storage, networking, and resource details.", "docker info [options]", ["--format"], ["docker info"], "Sharing output publicly without checking registry and host details.", ["docker version", "docker system df"]],
    ["intermediate", "docker context ls", "Docker context list", "Lists configured Docker endpoints and the active context.", "docker context ls", ["--format"], ["docker context ls"], "Running production commands against the wrong active context.", ["docker context use", "docker info"]],
  ],
  Images: [
    ["beginner", "docker image ls", "Docker image list", "Lists images stored by the current Docker daemon.", "docker image ls [options]", ["-a", "-q", "--filter"], ["docker image ls"], "Confusing an image repository name with a running container.", ["docker images", "docker image inspect"]],
    ["beginner", "docker pull", "Docker pull", "Downloads an image or tag from a registry.", "docker pull [options] image[:tag]", ["--platform", "-q"], ["docker pull nginx:1.27-alpine"], "Pulling `latest` and assuming it is immutable.", ["docker push", "docker image ls"]],
    ["intermediate", "docker image inspect", "Docker image inspect", "Shows low-level image metadata, layers, configuration, and digests.", "docker image inspect [options] image", ["--format"], ["docker image inspect nginx:alpine"], "Reading configured environment values as runtime overrides.", ["docker inspect", "docker history"]],
    ["intermediate", "docker image rm", "Docker image remove", "Removes local image references and unneeded layers.", "docker image rm [options] image", ["-f", "--no-prune"], ["docker image rm web:old"], "Removing an image still required by stopped containers.", ["docker rmi", "docker image prune"]],
  ],
  Containers: [
    ["beginner", "docker run", "Docker run", "Creates and starts a container from an image.", "docker run [options] image [command]", ["-d", "--name", "--rm", "-it"], ["docker run --name web -d nginx"], "Expecting a removed container's writable data to persist.", ["docker create", "docker start"]],
    ["beginner", "docker ps", "Docker process status", "Lists running containers.", "docker ps [options]", ["-a", "-q", "--filter", "--format"], ["docker ps -a"], "Forgetting `-a` when investigating exited containers.", ["docker container ls", "docker inspect"]],
    ["intermediate", "docker create", "Docker create", "Creates a container without starting its main process.", "docker create [options] image [command]", ["--name", "-e", "-v"], ["docker create --name api myapi:1.0"], "Assuming creation also starts the workload.", ["docker start", "docker run"]],
    ["intermediate", "docker container inspect", "Docker container inspect", "Displays complete runtime configuration and state for a container.", "docker container inspect [options] container", ["--format", "--size"], ["docker container inspect api"], "Scanning a large JSON document instead of selecting fields with `--format`.", ["docker stats", "docker port"]],
  ],
  Dockerfile: [
    ["beginner", "FROM", "Dockerfile FROM instruction", "Selects the base image and begins a build stage.", "FROM image[:tag] [AS name]", ["--platform"], ["FROM node:22-alpine"], "Using an unpinned moving tag for a reproducible production build.", ["ARG", "multi-stage build"]],
    ["beginner", "WORKDIR", "Dockerfile working directory", "Sets the working directory for later build instructions and runtime commands.", "WORKDIR /path", [], ["WORKDIR /app"], "Using repeated `RUN cd` commands that do not persist between layers.", ["COPY", "RUN"]],
    ["beginner", "COPY", "Dockerfile copy instruction", "Copies files from the build context or another stage into an image.", "COPY [options] source destination", ["--from", "--chown", "--chmod"], ["COPY package*.json ./"], "Copying the entire context before dependency installation and breaking cache reuse.", ["ADD", ".dockerignore"]],
    ["beginner", "CMD", "Dockerfile command instruction", "Defines the default command or arguments for a container.", "CMD [\"executable\", \"arg\"]", [], ["CMD [\"npm\", \"start\"]"], "Adding multiple CMD instructions and expecting all of them to run.", ["ENTRYPOINT", "RUN"]],
  ],
  "Build context": [
    ["beginner", "docker build .", "Docker build context", "Uses the current directory as the files available to a Docker build.", "docker build [options] context", ["-f", "-t", "--build-arg"], ["docker build -t api:1.0 ."], "Sending secrets, dependencies, or build output in an oversized context.", [".dockerignore", "COPY"]],
    ["beginner", ".dockerignore", "Docker ignore file", "Excludes matching paths from the build context.", ".dockerignore patterns", ["!", "**"], ["node_modules\n.git\n.env"], "Assuming ignored files can still be copied by the Dockerfile.", ["build context", ".gitignore"]],
    ["intermediate", "docker build -f", "Dockerfile selection", "Builds with a Dockerfile at a non-default path.", "docker build -f path/Dockerfile context", ["-f", "--file"], ["docker build -f docker/Dockerfile ."], "Using the Dockerfile directory as context accidentally.", ["docker build", "build context"]],
    ["intermediate", "docker build -", "Standard-input build", "Reads a Dockerfile or build context archive from standard input.", "docker build -", ["-t"], ["docker build -t scratch-demo -"], "Expecting local files to be available when only a Dockerfile is streamed.", ["docker build", "COPY"]],
  ],
  "Tags and registries": [
    ["beginner", "docker tag", "Docker tag", "Adds another repository and tag reference to an existing image.", "docker tag source target", [], ["docker tag web:1.0 student/web:1.0"], "Thinking a tag creates a full duplicate of image layers.", ["docker push", "image digest"]],
    ["beginner", "docker push", "Docker push", "Uploads tagged image layers and metadata to a registry.", "docker push [options] name[:tag]", ["-a", "-q"], ["docker push student/web:1.0"], "Pushing a local-only name without a registry namespace.", ["docker login", "docker tag"]],
    ["beginner", "docker login", "Docker registry login", "Authenticates the Docker client to a registry.", "docker login [options] [server]", ["-u", "--password-stdin"], ["echo \"$TOKEN\" | docker login -u student --password-stdin"], "Passing a password directly on the command line.", ["docker logout", "credential store"]],
    ["intermediate", "image digest", "Content-addressable image digest", "Identifies immutable image content with a cryptographic hash.", "image@sha256:digest", [], ["docker pull nginx@sha256:abc123"], "Treating a mutable tag as equivalent to a digest.", ["docker inspect", "docker pull"]],
  ],
  Volumes: [
    ["beginner", "docker volume create", "Docker volume create", "Creates Docker-managed persistent storage.", "docker volume create [options] name", ["--driver", "--label"], ["docker volume create postgres-data"], "Creating a volume but mounting a different misspelled name.", ["docker volume ls", "mount"]],
    ["beginner", "docker volume ls", "Docker volume list", "Lists volumes known to the daemon.", "docker volume ls [options]", ["-q", "--filter"], ["docker volume ls"], "Assuming every unused-looking volume is safe to delete.", ["docker volume inspect", "docker volume prune"]],
    ["intermediate", "docker volume inspect", "Docker volume inspect", "Shows a volume's driver, labels, mount point, and options.", "docker volume inspect [options] volume", ["--format"], ["docker volume inspect postgres-data"], "Editing files directly under Docker's internal mount point.", ["docker inspect", "docker volume ls"]],
    ["intermediate", "docker run --mount volume", "Volume mount", "Attaches a named volume to a path inside a container.", "docker run --mount type=volume,src=name,dst=/path image", ["readonly", "volume-subpath"], ["docker run --mount type=volume,src=data,dst=/var/lib/app app"], "Reversing source and destination paths.", ["-v", "docker volume create"]],
  ],
  "Bind mounts": [
    ["beginner", "docker run -v host:container", "Bind mount shorthand", "Mounts a host path into a container path.", "docker run -v host_path:container_path image", ["ro", "z", "Z"], ["docker run -v \"$PWD\":/app node:22"], "Mounting over files already present in the image.", ["--mount", "volume"]],
    ["intermediate", "docker run --mount bind", "Bind mount", "Declares a bind mount with explicit key-value syntax.", "docker run --mount type=bind,src=host,dst=container image", ["readonly", "bind-propagation"], ["docker run --mount type=bind,src=\"$PWD\",dst=/app node:22"], "Using a relative source path where an absolute path is required.", ["-v", "bind propagation"]],
    ["intermediate", "read-only bind mount", "Read-only bind mount", "Prevents a container from writing through a bind mount.", "source:destination:ro", ["ro", "readonly"], ["docker run -v \"$PWD/config\":/app/config:ro app"], "Assuming a read-only mount makes the whole container filesystem read-only.", ["--read-only", "bind mount"]],
    ["advanced", "bind propagation", "Bind propagation", "Controls whether nested mount changes propagate between host and container.", "bind-propagation=mode", ["rprivate", "rshared", "rslave"], ["docker run --mount type=bind,src=/mnt,dst=/mnt,bind-propagation=rshared app"], "Changing propagation without understanding host mount behavior.", ["mount namespace", "--privileged"]],
  ],
  Networks: [
    ["beginner", "docker network create", "Docker network create", "Creates a user-defined network with container DNS.", "docker network create [options] name", ["--driver", "--subnet", "--label"], ["docker network create app-net"], "Using the default bridge and expecting name-based discovery.", ["docker network connect", "bridge network"]],
    ["beginner", "docker network ls", "Docker network list", "Lists networks available to the Docker daemon.", "docker network ls [options]", ["-q", "--filter"], ["docker network ls"], "Confusing host network interfaces with Docker network objects.", ["docker network inspect", "ip"]],
    ["intermediate", "docker network connect", "Docker network connect", "Attaches an existing container to another network.", "docker network connect [options] network container", ["--alias", "--ip"], ["docker network connect app-net api"], "Expecting disconnected applications to update cached DNS immediately.", ["docker network disconnect", "docker network inspect"]],
    ["intermediate", "docker network inspect", "Docker network inspect", "Shows network configuration and attached containers.", "docker network inspect [options] network", ["--format", "--verbose"], ["docker network inspect app-net"], "Looking only at container configuration during connectivity failures.", ["docker inspect", "docker network ls"]],
  ],
  "Ports and publishing": [
    ["beginner", "docker run -p", "Publish port", "Maps a host port to a container port.", "docker run -p [host_ip:]host_port:container_port image", ["-p", "--publish"], ["docker run -p 8080:80 nginx"], "Reversing host and container port order.", ["EXPOSE", "docker port"]],
    ["intermediate", "docker run -P", "Publish all exposed ports", "Publishes every exposed container port to random host ports.", "docker run -P image", ["-P", "--publish-all"], ["docker run -P nginx"], "Assuming the random host port matches the container port.", ["docker port", "EXPOSE"]],
    ["beginner", "docker port", "Docker port mapping", "Lists published port mappings for a container.", "docker port container [private_port]", [], ["docker port web"], "Using it for an un-published EXPOSE declaration.", ["docker ps", "docker inspect"]],
    ["intermediate", "127.0.0.1 port binding", "Loopback port publishing", "Publishes a container port only on the host loopback interface.", "-p 127.0.0.1:host:container", ["-p"], ["docker run -p 127.0.0.1:5432:5432 postgres"], "Publishing databases on every host interface unnecessarily.", ["firewall", "host network"]],
  ],
  "Environment variables": [
    ["beginner", "docker run -e", "Container environment variable", "Sets or forwards an environment variable at container creation.", "docker run -e NAME=value image", ["-e", "--env"], ["docker run -e NODE_ENV=production api"], "Embedding secrets directly in shell history.", ["--env-file", "ENV"]],
    ["beginner", "docker run --env-file", "Environment file", "Loads multiple container environment variables from a file.", "docker run --env-file path image", ["--env-file"], ["docker run --env-file .env api"], "Including an environment file in the image or Git repository.", ["-e", "Docker secrets"]],
    ["beginner", "ENV", "Dockerfile ENV instruction", "Sets an environment variable in the image and future containers.", "ENV NAME=value", [], ["ENV NODE_ENV=production"], "Baking credentials into image metadata.", ["ARG", "docker run -e"]],
    ["intermediate", "ARG", "Dockerfile build argument", "Defines a value available during image build.", "ARG NAME[=default]", [], ["ARG NODE_VERSION=22"], "Expecting an ARG to exist at runtime without copying it into ENV.", ["--build-arg", "ENV"]],
  ],
  "Logs and debugging": [
    ["beginner", "docker logs", "Docker logs", "Reads stdout and stderr captured from a container.", "docker logs [options] container", ["-f", "--tail", "--since", "-t"], ["docker logs --tail 100 api"], "Expecting logs written only to files inside the container.", ["logging driver", "docker attach"]],
    ["beginner", "docker logs -f", "Follow Docker logs", "Streams new container log output.", "docker logs -f container", ["-f", "--follow"], ["docker logs -f api"], "Leaving an unbounded follow session in automation.", ["docker logs", "Ctrl-C"]],
    ["intermediate", "docker stats", "Docker statistics", "Streams container CPU, memory, network, and block I/O usage.", "docker stats [options] [container...]", ["--no-stream", "--format"], ["docker stats --no-stream api"], "Comparing memory values without considering configured limits.", ["docker top", "docker inspect"]],
    ["intermediate", "docker events", "Docker events", "Streams daemon events such as create, start, die, and destroy.", "docker events [options]", ["--since", "--until", "--filter"], ["docker events --since 10m"], "Collecting all events without time or object filters.", ["docker inspect", "journalctl"]],
  ],
  "Exec and shell access": [
    ["beginner", "docker exec", "Docker execute", "Runs a new command inside a running container.", "docker exec [options] container command", ["-i", "-t", "-u", "-e", "-w"], ["docker exec api env"], "Trying to exec into a stopped container.", ["docker run", "docker debug"]],
    ["beginner", "docker exec -it sh", "Interactive container shell", "Starts an interactive shell in a running container.", "docker exec -it container sh", ["-i", "-t"], ["docker exec -it api /bin/sh"], "Assuming minimal images include Bash.", ["docker exec", "docker attach"]],
    ["intermediate", "docker exec -u", "Execute as user", "Runs a diagnostic command as a selected user inside a container.", "docker exec -u user container command", ["-u", "--user"], ["docker exec -u root api id"], "Using root diagnostics as the normal application runtime identity.", ["USER", "docker exec"]],
    ["intermediate", "docker top", "Docker top", "Displays host process information for a container's processes.", "docker top container [ps options]", [], ["docker top api"], "Expecting process IDs to match those visible inside the container namespace.", ["ps", "docker stats"]],
  ],
  "Container lifecycle": [
    ["beginner", "docker stop", "Docker stop", "Requests graceful container shutdown and then forces termination after a timeout.", "docker stop [options] container", ["-t", "--signal"], ["docker stop -t 30 api"], "Using forceful removal before allowing graceful cleanup.", ["docker kill", "STOPSIGNAL"]],
    ["beginner", "docker rm", "Docker remove", "Removes stopped container metadata and its writable layer.", "docker rm [options] container", ["-f", "-v"], ["docker rm api"], "Expecting named volumes to be removed automatically.", ["docker stop", "docker container prune"]],
    ["beginner", "docker restart", "Docker restart", "Stops and starts one or more containers.", "docker restart [options] container", ["-t", "--signal"], ["docker restart api"], "Using restart instead of fixing a repeatedly failing process.", ["docker stop", "restart policy"]],
    ["intermediate", "docker wait", "Docker wait", "Blocks until a container exits and prints its exit code.", "docker wait container", [], ["docker wait test-run"], "Using detached test containers without collecting their exit status.", ["docker run", "docker inspect"]],
  ],
  "Docker Compose basics": [
    ["beginner", "docker compose up", "Docker Compose up", "Creates and starts services defined in a Compose file.", "docker compose up [options] [service...]", ["-d", "--build", "--force-recreate"], ["docker compose up -d --build"], "Changing build inputs without requesting a rebuild.", ["docker compose down", "compose.yaml"]],
    ["beginner", "docker compose down", "Docker Compose down", "Stops and removes a Compose application's containers and networks.", "docker compose down [options]", ["-v", "--remove-orphans", "--rmi"], ["docker compose down"], "Using `-v` and unintentionally deleting persistent data.", ["docker compose stop", "docker compose up"]],
    ["beginner", "docker compose ps", "Docker Compose process status", "Lists containers belonging to the current Compose project.", "docker compose ps [options]", ["-a", "-q", "--status"], ["docker compose ps -a"], "Running it from a directory that selects a different project.", ["docker compose logs", "docker ps"]],
    ["intermediate", "docker compose config", "Docker Compose configuration", "Parses, merges, interpolates, and renders the effective Compose model.", "docker compose config [options]", ["--services", "--profiles", "--quiet"], ["docker compose config"], "Debugging interpolation without first viewing the rendered configuration.", ["docker compose convert", "environment interpolation"]],
  ],
  "Multi-stage builds": [
    ["intermediate", "FROM ... AS build", "Named build stage", "Names a build stage so later stages can copy artifacts from it.", "FROM image AS stage", [], ["FROM node:22-alpine AS build"], "Giving stages ambiguous names that obscure their purpose.", ["COPY --from", "target stage"]],
    ["intermediate", "COPY --from", "Cross-stage copy", "Copies selected artifacts from an earlier build stage.", "COPY --from=stage source destination", ["--chown", "--chmod"], ["COPY --from=build /app/dist /usr/share/nginx/html"], "Copying the whole build workspace and retaining development dependencies.", ["multi-stage build", "FROM"]],
    ["intermediate", "docker build --target", "Build target stage", "Stops a multi-stage build at a named stage.", "docker build --target stage context", ["--target"], ["docker build --target test -t app:test ."], "Assuming later production stages are validated when building an early target.", ["FROM AS", "BuildKit"]],
    ["advanced", "external stage", "External image stage", "Copies files directly from another image or named build context.", "COPY --from=image source destination", ["--from"], ["COPY --from=nginx:alpine /etc/nginx/nginx.conf /tmp/nginx.conf"], "Using mutable external tags in reproducible builds.", ["image digest", "named context"]],
  ],
  "Image optimization": [
    ["beginner", "layer cache ordering", "Docker layer cache ordering", "Places stable dependency steps before frequently changing source files.", "COPY manifests; RUN install; COPY source", [], ["COPY package*.json ./\nRUN npm ci\nCOPY . ."], "Copying all source before installing dependencies.", ["BuildKit cache", ".dockerignore"]],
    ["intermediate", "RUN cleanup", "Build-layer cleanup", "Removes package indexes and temporary files in the same layer that created them.", "RUN install && cleanup", [], ["RUN apk add --no-cache curl"], "Deleting files in a later layer and expecting the earlier layer to shrink.", ["layer", "multi-stage build"]],
    ["intermediate", "docker history", "Docker image history", "Shows image layers, commands, timestamps, and approximate sizes.", "docker history [options] image", ["--no-trunc", "-H", "-q"], ["docker history web:1.0"], "Treating history size as an exact registry transfer measurement.", ["docker image inspect", "dive"]],
    ["advanced", "BuildKit cache mount", "BuildKit cache mount", "Provides reusable package-manager cache storage during a build without adding it to the image.", "RUN --mount=type=cache,target=path command", ["id", "sharing"], ["RUN --mount=type=cache,target=/root/.npm npm ci"], "Assuming cache contents become part of the final layer.", ["DOCKER_BUILDKIT", "docker buildx"]],
  ],
  "Security basics": [
    ["beginner", "USER", "Dockerfile USER instruction", "Selects the non-root identity for later instructions and container startup.", "USER user[:group]", [], ["USER node"], "Creating a user but forgetting to switch to it.", ["docker run --user", "chown"]],
    ["intermediate", "docker run --read-only", "Read-only root filesystem", "Prevents writes to the container root filesystem.", "docker run --read-only image", ["--tmpfs"], ["docker run --read-only --tmpfs /tmp api"], "Enabling read-only mode without writable mounts for required paths.", ["tmpfs", "volume"]],
    ["intermediate", "docker run --cap-drop", "Drop Linux capability", "Removes kernel capabilities from a container process.", "docker run --cap-drop capability image", ["--cap-add", "--cap-drop"], ["docker run --cap-drop ALL --cap-add NET_BIND_SERVICE api"], "Adding `--privileged` instead of granting one required capability.", ["seccomp", "AppArmor"]],
    ["advanced", "docker run --security-opt", "Container security option", "Configures security profiles and privilege behavior.", "docker run --security-opt option image", ["no-new-privileges", "seccomp", "apparmor"], ["docker run --security-opt no-new-privileges api"], "Disabling a security profile globally to solve one application issue.", ["seccomp", "capabilities"]],
  ],
  Troubleshooting: [
    ["beginner", "docker inspect --format", "Formatted Docker inspection", "Extracts a selected value from Docker object metadata.", "docker inspect --format template object", ["-f", "--format"], ["docker inspect -f '{{.State.ExitCode}}' api"], "Guessing object state instead of reading exit codes and errors.", ["Go template", "docker ps"]],
    ["intermediate", "docker system df", "Docker system disk free", "Reports disk usage by images, containers, volumes, and build cache.", "docker system df [options]", ["-v", "--format"], ["docker system df -v"], "Running broad prune commands before identifying the disk consumer.", ["docker system prune", "docker builder prune"]],
    ["intermediate", "docker system prune", "Docker system prune", "Removes selected unused containers, networks, images, and build cache.", "docker system prune [options]", ["-a", "--volumes", "-f"], ["docker system prune"], "Adding `--volumes` without confirming persistent data ownership.", ["docker image prune", "docker volume prune"]],
    ["advanced", "docker debug", "Docker debug", "Starts a toolbox environment for diagnosing containers, including minimal images.", "docker debug container", [], ["docker debug api"], "Modifying production state during an evidence-gathering session.", ["docker exec", "nsenter"]],
  ],
  "DevOps workflows": [
    ["intermediate", "docker buildx build", "Docker Buildx build", "Builds with BuildKit features such as multi-platform output and remote caches.", "docker buildx build [options] context", ["--platform", "--push", "--cache-from", "--cache-to"], ["docker buildx build --platform linux/amd64,linux/arm64 --push -t user/api:1.0 ."], "Building multiple platforms without pushing or loading the result.", ["BuildKit", "manifest list"]],
    ["intermediate", "docker build --pull", "Refresh base image", "Checks for a newer version of referenced base-image tags during build.", "docker build --pull [options] context", ["--pull", "--no-cache"], ["docker build --pull -t api:1.0 ."], "Using `--no-cache` routinely instead of diagnosing cache inputs.", ["docker pull", "image digest"]],
    ["intermediate", "docker save", "Docker image save", "Exports one or more images and metadata as a tar archive.", "docker save [options] image", ["-o", "--output"], ["docker save -o api.tar api:1.0"], "Using `docker export` when image history and metadata are required.", ["docker load", "docker export"]],
    ["intermediate", "docker scan workflow", "Container image scanning", "Checks built images for known vulnerabilities before promotion.", "scanner image:tag", ["--severity", "--exit-code"], ["docker scout cves api:1.0"], "Treating a clean vulnerability scan as complete runtime security.", ["SBOM", "image signing"]],
  ],
};

export const dockerCommandCatalog = Object.entries(rows).flatMap(
  ([category, items]) => items.map((item) => entry(category, ...item)),
);

export const dockerCategories = Object.keys(rows);

export const dockerReference = dockerCategories.map((category) => ({
  category,
  commands: dockerCommandCatalog.filter((item) => item.category === category),
}));

export const dockerFlashcards = dockerCommandCatalog.map((item, index) => ({
  id: index === 0 ? "docker-fc-image" : `docker-fc-${index + 1}`,
  category: item.category,
  difficulty: item.difficulty,
  front: `What should you know about \`${item.command}\`?`,
  basicExplanation: item.basicExplanation,
  professionalExplanation: item.professionalExplanation,
  example: item.examples[0],
  useCase: item.devOpsUseCase,
  relatedConcepts: item.relatedCommands,
}));

export const dockerMultipleChoice = dockerCommandCatalog.map((item, index, catalog) => ({
  id: `docker-mcq-${index + 1}`,
  category: item.category,
  question: `Which Docker command or concept best matches this task: ${item.basicExplanation.toLowerCase()}`,
  options: [
    item.command,
    catalog[(index + 9) % catalog.length].command,
    catalog[(index + 27) % catalog.length].command,
    catalog[(index + 51) % catalog.length].command,
  ],
  answer: 0,
  explanation: `\`${item.command}\`: ${item.professionalExplanation}`,
}));

export const dockerCommandQuiz = dockerCommandCatalog.map((item, index) => ({
  id: `docker-command-${index + 1}`,
  category: item.category,
  prompt: `Write the Docker command, Dockerfile instruction, or configuration form for this task: ${item.basicExplanation}`,
  answers: item.answers,
  explanation: `${item.commonSyntax}. ${item.professionalExplanation}`,
}));
