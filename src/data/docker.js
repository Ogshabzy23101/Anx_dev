export const dockerReference = [
  {
    category: "Images & builds",
    commands: [
      { command: "docker build -t myapp:1.0 .", description: "Build an image from the current build context and tag it." },
      { command: "docker image ls", description: "List images stored by the local Docker daemon." },
      { command: "docker tag myapp:1.0 user/myapp:1.0", description: "Add a registry-ready name and tag to an image." },
      { command: "docker push user/myapp:1.0", description: "Push a tagged image to Docker Hub or another registry." },
    ],
  },
  {
    category: "Containers",
    commands: [
      { command: "docker run -d --name web nginx", description: "Create and start a detached container from an image." },
      { command: "docker ps -a", description: "List running and stopped containers." },
      { command: "docker stop web", description: "Gracefully stop a running container." },
      { command: "docker rm web", description: "Remove a stopped container." },
    ],
  },
  {
    category: "Runtime configuration",
    commands: [
      { command: "docker run -p 8080:80 nginx", description: "Map host port 8080 to container port 80." },
      { command: "docker run -e NODE_ENV=production myapp", description: "Pass an environment variable into a container." },
      { command: "docker run -v app-data:/data myapp", description: "Mount a named volume for persistent data." },
      { command: "docker run --network app-net myapp", description: "Connect a new container to a Docker network." },
    ],
  },
  {
    category: "Inspection & debugging",
    commands: [
      { command: "docker exec -it web sh", description: "Start an interactive shell inside a running container." },
      { command: "docker logs -f web", description: "Follow a container's standard output and error logs." },
      { command: "docker inspect web", description: "Display detailed low-level container configuration." },
      { command: "docker network inspect app-net", description: "Inspect a network and its connected containers." },
    ],
  },
  {
    category: "Dockerfile concepts",
    commands: [
      { command: "FROM node:22-alpine", description: "Choose the base image at the start of a Dockerfile build stage." },
      { command: "WORKDIR /app", description: "Set the working directory for later instructions." },
      { command: "COPY package*.json ./", description: "Copy files from the build context into the image." },
      { command: "FROM node AS build", description: "Name a stage in a multi-stage build so later stages can copy only its artifacts." },
    ],
  },
];

export const dockerFlashcards = [
  { id: "docker-fc-image", front: "What is a Docker image?", back: "An immutable, layered template used to create containers." },
  { id: "docker-fc-container", front: "How does a container differ from an image?", back: "A container is a runnable instance of an image with its own writable layer." },
  { id: "docker-fc-context", front: "What is the Docker build context?", back: "The directory or archive whose files are available to COPY and ADD during a build." },
  { id: "docker-fc-port", front: "What does `-p 8080:80` mean?", back: "Traffic to host port 8080 is forwarded to port 80 in the container." },
  { id: "docker-fc-volume", front: "Why use a Docker volume?", back: "To persist or share data independently of a container's lifecycle." },
  { id: "docker-fc-network", front: "What does a user-defined Docker network provide?", back: "Isolated container connectivity with automatic DNS resolution by container name." },
  { id: "docker-fc-layer", front: "Why copy package manifests before application source?", back: "It lets Docker reuse the dependency-install layer when only source files change." },
  { id: "docker-fc-multistage", front: "What is the benefit of a multi-stage build?", back: "Build tools stay in an earlier stage while the final image contains only runtime artifacts." },
];

export const dockerMultipleChoice = [
  {
    id: "docker-mc-context",
    question: "What does the final dot mean in `docker build -t api .`?",
    options: ["Use the default tag", "Use the current directory as build context", "Run in detached mode", "Build every Dockerfile"],
    answer: 1,
    explanation: "The final argument is the build context; `.` selects the current directory.",
  },
  {
    id: "docker-mc-ports",
    question: "Which option maps host port 8080 to container port 80?",
    options: ["-p 80:8080", "-p 8080:80", "--expose 8080", "--port 80"],
    answer: 1,
    explanation: "Port publishing uses `host:container` order.",
  },
  {
    id: "docker-mc-stopped",
    question: "Which command includes stopped containers?",
    options: ["docker ps", "docker images -a", "docker ps -a", "docker inspect --stopped"],
    answer: 2,
    explanation: "`docker ps -a` lists containers in every state.",
  },
  {
    id: "docker-mc-env",
    question: "Which flag passes an environment variable to `docker run`?",
    options: ["-e", "-v", "-p", "-t"],
    answer: 0,
    explanation: "`-e` or `--env` sets an environment variable in the container.",
  },
  {
    id: "docker-mc-volume",
    question: "What remains after a container using a named volume is removed?",
    options: ["Nothing", "Only container logs", "The named volume and its data", "The container writable layer"],
    answer: 2,
    explanation: "Named volumes have a lifecycle independent of the containers that mount them.",
  },
  {
    id: "docker-mc-multistage",
    question: "What does `COPY --from=build` do in a Dockerfile?",
    options: ["Copies from the host build folder", "Copies artifacts from a named build stage", "Clones a remote image", "Restarts the build stage"],
    answer: 1,
    explanation: "The `--from` option copies files from an earlier named stage.",
  },
];

export const dockerCommandQuiz = [
  {
    id: "docker-cmd-running",
    prompt: "List running containers.",
    answers: ["docker ps", "docker container ls"],
    explanation: "`docker ps` and `docker container ls` list running containers.",
  },
  {
    id: "docker-cmd-all",
    prompt: "List all containers, including stopped containers.",
    answers: ["docker ps -a", "docker ps --all", "docker container ls -a", "docker container ls --all"],
    explanation: "Add `-a` or `--all` to include stopped containers.",
  },
  {
    id: "docker-cmd-build",
    prompt: "Build the current directory as an image tagged `web:1.0`.",
    answers: ["docker build -t web:1.0 .", "docker build --tag web:1.0 ."],
    explanation: "`docker build -t name:tag context` builds and tags an image.",
  },
  {
    id: "docker-cmd-detached",
    prompt: "Run an `nginx` container in detached mode.",
    answers: ["docker run -d nginx", "docker run --detach nginx"],
    explanation: "`-d` or `--detach` starts the container in the background.",
  },
  {
    id: "docker-cmd-port",
    prompt: "Run `nginx` and map host port 8080 to container port 80.",
    answers: ["docker run -p 8080:80 nginx", "docker run --publish 8080:80 nginx"],
    explanation: "Published ports use the `host:container` order.",
  },
  {
    id: "docker-cmd-env",
    prompt: "Run `myapp` with `NODE_ENV=production`.",
    answers: ["docker run -e NODE_ENV=production myapp", "docker run --env NODE_ENV=production myapp"],
    explanation: "`-e` or `--env` passes an environment variable.",
  },
  {
    id: "docker-cmd-logs",
    prompt: "View logs for a container named `api`.",
    answers: ["docker logs api", "docker container logs api"],
    explanation: "`docker logs` retrieves output written by the container process.",
  },
  {
    id: "docker-cmd-exec",
    prompt: "Open an interactive shell in the running container `api`.",
    answers: ["docker exec -it api sh", "docker exec -it api /bin/sh", "docker container exec -it api sh", "docker container exec -it api /bin/sh"],
    explanation: "`docker exec -it` starts an interactive command in a running container.",
  },
  {
    id: "docker-cmd-remove",
    prompt: "Stop and then remove the container `api` in one shell line.",
    answers: ["docker stop api && docker rm api", "docker container stop api && docker container rm api"],
    explanation: "Stop the container before removing it; `&&` runs removal only after a successful stop.",
  },
  {
    id: "docker-cmd-network",
    prompt: "Create the network `labnet`, then run `nginx` attached to it.",
    answers: [
      "docker network create labnet && docker run --network labnet nginx",
      "docker network create labnet && docker run --net labnet nginx",
    ],
    explanation: "Create a user-defined network, then select it with `--network` when starting the container.",
  },
  {
    id: "docker-cmd-push",
    prompt: "Tag `web:1.0` as `student/web:1.0`, then push it.",
    answers: [
      "docker tag web:1.0 student/web:1.0 && docker push student/web:1.0",
      "docker image tag web:1.0 student/web:1.0 && docker image push student/web:1.0",
    ],
    explanation: "A registry image name must be applied before `docker push` can upload it.",
  },
];

export const dockerFilePractice = [
  {
    id: "dockerfile-node",
    title: "Node.js application",
    filename: "Dockerfile",
    instruction: "Write a Dockerfile for a Node.js app that installs dependencies, copies the source, exposes port 3000, and starts with `npm start`.",
    starter: "",
    solution: "FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n",
    rules: [
      { label: "FROM a Node.js image", pattern: /^\s*FROM\s+node(?:[:@\s]|$)/im },
      { label: "WORKDIR", pattern: /^\s*WORKDIR\s+\S+/im },
      { label: "COPY package files", pattern: /^\s*COPY\s+[^\n]*package[^\n]*/im },
      { label: "RUN npm install", pattern: /^\s*RUN\s+npm\s+(?:install|i)\b/im },
      { label: "COPY application source", pattern: /^\s*COPY\s+\.\s+\./im },
      { label: "EXPOSE 3000", pattern: /^\s*EXPOSE\s+3000\b/im },
      { label: "CMD npm start", pattern: /^\s*CMD\s+.*npm.*start/im },
    ],
  },
  {
    id: "dockerfile-nginx",
    title: "Nginx static site",
    filename: "Dockerfile",
    instruction: "Write a Dockerfile that serves the current static site with Nginx on port 80.",
    starter: "",
    solution: "FROM nginx:alpine\nCOPY . /usr/share/nginx/html\nEXPOSE 80\n",
    rules: [
      { label: "FROM an Nginx image", pattern: /^\s*FROM\s+nginx(?:[:@\s]|$)/im },
      { label: "COPY site files to the Nginx html directory", pattern: /^\s*COPY\s+[^\n]*\/usr\/share\/nginx\/html\/?\s*$/im },
      { label: "EXPOSE 80", pattern: /^\s*EXPOSE\s+80\b/im },
    ],
  },
  {
    id: "dockerfile-vite-multistage",
    title: "React/Vite multi-stage build",
    filename: "Dockerfile",
    instruction: "Write a multi-stage Dockerfile that builds a Vite app with Node.js and serves the `dist` output with Nginx.",
    starter: "",
    solution: "FROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nEXPOSE 80\n",
    rules: [
      { label: "a named Node.js build stage", pattern: /^\s*FROM\s+node[^\n]*\s+AS\s+build\s*$/im },
      { label: "WORKDIR", pattern: /^\s*WORKDIR\s+\S+/im },
      { label: "RUN npm install", pattern: /^\s*RUN\s+npm\s+(?:install|i)\b/im },
      { label: "RUN npm run build", pattern: /^\s*RUN\s+npm\s+run\s+build\b/im },
      { label: "a final Nginx stage", pattern: /^\s*FROM\s+nginx(?:[:@\s]|$)/im },
      { label: "COPY --from=build", pattern: /^\s*COPY\s+--from=build\s+[^\n]+/im },
      { label: "the dist build output", pattern: /\bdist\/?\b/i },
    ],
  },
  {
    id: "dockerfile-directives",
    title: "Core Dockerfile instructions",
    filename: "Dockerfile",
    instruction: "Write a Node.js Dockerfile using FROM, WORKDIR, COPY, RUN npm install, EXPOSE, and CMD.",
    starter: "",
    solution: "FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n",
    rules: [
      { label: "FROM", pattern: /^\s*FROM\s+\S+/im },
      { label: "WORKDIR", pattern: /^\s*WORKDIR\s+\S+/im },
      { label: "COPY", pattern: /^\s*COPY\s+\S+/im },
      { label: "RUN npm install", pattern: /^\s*RUN\s+npm\s+(?:install|i)\b/im },
      { label: "EXPOSE", pattern: /^\s*EXPOSE\s+\d+/im },
      { label: "CMD", pattern: /^\s*CMD\s+.+/im },
    ],
  },
  {
    id: "dockerignore-node",
    title: "Node.js .dockerignore",
    filename: ".dockerignore",
    instruction: "Write a `.dockerignore` file that excludes dependencies, build output, Git metadata, and npm debug logs.",
    starter: "",
    solution: "node_modules\ndist\n.git\nnpm-debug.log*\n",
    rules: [
      { label: "node_modules", pattern: /^\s*node_modules\/?\s*$/im },
      { label: "dist", pattern: /^\s*dist\/?\s*$/im },
      { label: ".git", pattern: /^\s*\.git\/?\s*$/im },
      { label: "npm debug logs", pattern: /^\s*npm-debug\.log\*?\s*$/im },
    ],
  },
];
