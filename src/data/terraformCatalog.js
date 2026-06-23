const categoryDefinitions = [
  ["Terraform basics", "understanding Terraform as declarative infrastructure as code", ["terraform", "hcl", "graph"], ["plan", "state"], [["Infrastructure as Code", "beginner", "terraform version"], ["HCL", "beginner", "terraform fmt"], ["desired state", "beginner", "terraform plan"], ["dependency graph", "intermediate", "terraform graph"]]],
  ["Providers", "configuring API plugins and provider versions", ["source", "version", "alias"], ["resources", "data sources"], [["provider block", "beginner", "terraform providers"], ["required_providers", "beginner", "terraform init"], ["provider alias", "intermediate", "terraform providers"], ["provider lock file", "intermediate", "terraform init -upgrade"]]],
  ["Resources", "declaring managed infrastructure objects", ["resource", "type", "name"], ["state", "lifecycle"], [["resource block", "beginner", "terraform state list"], ["resource address", "beginner", "terraform state show aws_instance.web"], ["resource drift", "intermediate", "terraform plan -refresh-only"], ["resource targeting", "advanced", "terraform plan -target=aws_instance.web"]]],
  ["Data sources", "reading existing data source information without managing it", ["data", "filters", "outputs"], ["resources", "providers"], [["data source block", "beginner", "terraform validate"], ["aws_ami lookup", "beginner", "terraform plan"], ["data reference", "intermediate", "terraform console"], ["external data", "advanced", "terraform plan"]]],
  ["Variables", "parameterizing reusable configuration", ["type", "default", "validation"], ["tfvars", "sensitive"], [["variable block", "beginner", "terraform validate"], ["variable file", "beginner", "terraform plan -var-file=dev.tfvars"], ["CLI variable", "beginner", "terraform plan -var instance_type=t3.micro"], ["variable validation", "intermediate", "terraform validate"]]],
  ["Outputs", "exposing root or module values", ["value", "description", "sensitive"], ["modules", "remote state"], [["output block", "beginner", "terraform output"], ["single output", "beginner", "terraform output instance_ip"], ["json output", "intermediate", "terraform output -json"], ["sensitive output", "intermediate", "terraform output -raw password"]]],
  ["Locals", "naming reusable local value expressions within a module", ["locals", "expressions", "maps"], ["variables", "outputs"], [["locals block", "beginner", "terraform validate"], ["local value reference", "beginner", "terraform console"], ["naming local", "intermediate", "terraform plan"], ["computed tags", "intermediate", "terraform console"]]],
  ["State", "mapping configuration addresses to real infrastructure", ["state", "serial", "lineage"], ["backend", "import"], [["state file", "beginner", "terraform state list"], ["state show", "beginner", "terraform state show aws_instance.web"], ["state pull", "intermediate", "terraform state pull"], ["state mv", "advanced", "terraform state mv aws_instance.old aws_instance.web"]]],
  ["Remote state", "sharing durable state for teams and automation", ["backend", "locking", "outputs"], ["S3 backend", "terraform_remote_state"], [["remote state", "beginner", "terraform init"], ["state lock", "intermediate", "terraform apply"], ["remote outputs", "intermediate", "terraform output"], ["state pull remote", "advanced", "terraform state pull"]]],
  ["Backends", "configuring where Terraform stores state", ["backend", "bucket", "key"], ["S3", "locking"], [["backend block", "beginner", "terraform init"], ["backend reconfigure", "intermediate", "terraform init -reconfigure"], ["backend migrate", "intermediate", "terraform init -migrate-state"], ["backend config file", "advanced", "terraform init -backend-config=backend.hcl"]]],
  ["Workspaces", "separating state instances for one configuration", ["workspace", "state", "environment"], ["backend", "tfvars"], [["workspace list", "beginner", "terraform workspace list"], ["workspace new", "beginner", "terraform workspace new dev"], ["workspace select", "beginner", "terraform workspace select dev"], ["workspace show", "beginner", "terraform workspace show"]]],
  ["Modules", "composing reusable Terraform configuration", ["source", "version", "inputs"], ["outputs", "registry"], [["module block", "beginner", "terraform init"], ["module source", "beginner", "terraform get"], ["module upgrade", "intermediate", "terraform init -upgrade"], ["module output", "intermediate", "terraform output"]]],
  ["Count", "creating indexed resource or module instances", ["count", "count.index", "list"], ["for_each", "instances"], [["count meta-argument", "beginner", "terraform plan"], ["count index", "beginner", "terraform console"], ["count zero", "intermediate", "terraform plan"], ["count address", "intermediate", "terraform state show aws_instance.web[0]"]]],
  ["for_each", "creating keyed resource or module instances", ["for_each", "each.key", "each.value"], ["maps", "sets"], [["for_each meta-argument", "beginner", "terraform plan"], ["each key", "beginner", "terraform console"], ["each value", "beginner", "terraform console"], ["for_each address", "intermediate", "terraform state show aws_s3_bucket.logs[\"dev\"]"]]],
  ["Dynamic blocks", "generating repeated nested blocks from collections", ["dynamic", "for_each", "content"], ["for_each", "nested blocks"], [["dynamic block", "intermediate", "terraform validate"], ["dynamic ingress", "intermediate", "terraform plan"], ["iterator", "advanced", "terraform console"], ["dynamic content", "advanced", "terraform validate"]]],
  ["Lifecycle", "customizing replacement, destroy, and drift behavior", ["ignore_changes", "prevent_destroy", "create_before_destroy"], ["resources", "drift"], [["lifecycle block", "beginner", "terraform validate"], ["ignore_changes", "beginner", "terraform plan"], ["prevent_destroy", "intermediate", "terraform plan"], ["create_before_destroy", "intermediate", "terraform apply"]]],
  ["Dependencies", "controlling graph relationships when references are insufficient", ["depends_on", "references", "graph"], ["resources", "modules"], [["implicit dependency", "beginner", "terraform graph"], ["depends_on", "beginner", "terraform plan"], ["module depends_on", "intermediate", "terraform validate"], ["graph debug", "advanced", "terraform graph"]]],
  ["Provisioners", "running last-resort local or remote commands", ["local-exec", "remote-exec", "connection"], ["null_resource", "cloud-init"], [["local-exec", "intermediate", "terraform apply"], ["remote-exec", "advanced", "terraform apply"], ["connection block", "advanced", "terraform validate"], ["provisioner failure", "advanced", "terraform taint null_resource.setup"]]],
  ["Import", "bringing existing objects under Terraform state", ["import", "address", "id"], ["state", "configuration"], [["terraform import", "beginner", "terraform import aws_instance.web i-123456"], ["import block", "intermediate", "terraform plan"], ["state after import", "intermediate", "terraform state show aws_instance.web"], ["generate config", "advanced", "terraform plan -generate-config-out=generated.tf"]]],
  ["Plan and apply", "previewing and executing infrastructure changes", ["plan", "apply", "tfplan"], ["state", "providers"], [["terraform plan", "beginner", "terraform plan"], ["saved plan", "beginner", "terraform plan -out=tfplan"], ["apply plan", "beginner", "terraform apply tfplan"], ["auto approve", "intermediate", "terraform apply -auto-approve"]]],
  ["Destroy", "removing managed infrastructure safely", ["destroy", "target", "plan"], ["state", "dependencies"], [["terraform destroy", "beginner", "terraform destroy"], ["destroy plan", "beginner", "terraform plan -destroy"], ["destroy target", "advanced", "terraform destroy -target=aws_instance.web"], ["destroy approval", "intermediate", "terraform destroy -auto-approve"]]],
  ["Formatting and validation", "keeping HCL readable and syntactically valid", ["fmt", "validate", "check"], ["CI", "HCL"], [["terraform fmt", "beginner", "terraform fmt"], ["fmt recursive", "beginner", "terraform fmt -recursive"], ["terraform validate", "beginner", "terraform validate"], ["validate json", "intermediate", "terraform validate -json"]]],
  ["Security", "reducing infrastructure and workflow risk", ["least privilege", "policy", "state"], ["secrets", "IAM"], [["provider credentials", "beginner", "terraform plan"], ["least privilege IAM", "intermediate", "terraform plan"], ["policy review", "intermediate", "terraform show -json tfplan"], ["drift review", "advanced", "terraform plan -detailed-exitcode"]]],
  ["Secrets handling", "avoiding accidental disclosure of sensitive values", ["sensitive", "state", "variables"], ["backend encryption", "Vault"], [["sensitive variable", "beginner", "terraform validate"], ["sensitive output", "beginner", "terraform output"], ["state encryption", "intermediate", "terraform init"], ["secret tfvars", "intermediate", "terraform plan -var-file=secrets.auto.tfvars"]]],
  ["AWS examples", "modeling common AWS infrastructure with Terraform", ["region", "tags", "provider"], ["EC2", "VPC"], [["AWS provider", "beginner", "terraform providers"], ["default tags", "intermediate", "terraform plan"], ["AWS caller identity", "beginner", "terraform console"], ["AWS region variable", "beginner", "terraform plan -var aws_region=us-east-1"]]],
  ["VPC examples", "building AWS network foundations", ["aws_vpc", "cidr_block", "tags"], ["subnet", "route table"], [["aws_vpc", "beginner", "terraform plan"], ["aws_subnet", "beginner", "terraform plan"], ["internet gateway", "beginner", "terraform plan"], ["route table", "intermediate", "terraform graph"]]],
  ["EC2 examples", "creating compute instances and related security", ["aws_instance", "ami", "instance_type"], ["security group", "key pair"], [["aws_instance", "beginner", "terraform plan"], ["security group", "beginner", "terraform plan"], ["instance tags", "beginner", "terraform plan"], ["user_data", "intermediate", "terraform plan"]]],
  ["S3 backend", "storing Terraform state in S3", ["bucket", "key", "region"], ["DynamoDB", "encryption"], [["S3 backend", "beginner", "terraform init"], ["backend bucket", "beginner", "terraform init -backend-config=bucket=tf-state"], ["state key", "beginner", "terraform init"], ["encrypted state", "intermediate", "terraform init"]]],
  ["DynamoDB locking", "coordinating state writes with a lock table", ["dynamodb_table", "LockID", "S3"], ["backend", "state"], [["DynamoDB locking", "intermediate", "terraform init"], ["lock table", "intermediate", "terraform apply"], ["force unlock", "advanced", "terraform force-unlock LOCK_ID"], ["locking error", "intermediate", "terraform plan"]]],
  ["Troubleshooting", "diagnosing provider, state, graph, and plan issues", ["logs", "state", "providers"], ["debug", "graph"], [["TF_LOG debug", "advanced", "TF_LOG=DEBUG terraform plan"], ["state inspect", "beginner", "terraform state list"], ["provider schema", "advanced", "terraform providers schema -json"], ["refresh only", "intermediate", "terraform plan -refresh-only"]]],
  ["DevOps workflows", "integrating Terraform into CI/CD and review flows", ["plan file", "json", "locking"], ["CI/CD", "policy"], [["CI plan", "beginner", "terraform plan -out=tfplan"], ["plan JSON", "intermediate", "terraform show -json tfplan"], ["non-interactive apply", "intermediate", "terraform apply -input=false tfplan"], ["detailed exit code", "intermediate", "terraform plan -detailed-exitcode"]]],
];

function makeEntry([category, purpose, fields, related, items]) {
  return items.map(([command, difficulty, example]) => ({
    category,
    difficulty,
    command,
    topic: command,
    fullMeaning: command,
    description: `${command} is used for ${purpose}. Example workflow: ${example}.`,
    basicExplanation: `${command} is used for ${purpose}.`,
    professionalExplanation: `${command} supports repeatable infrastructure delivery by making configuration, state, or workflow intent explicit and reviewable.`,
    commonSyntax: example,
    syntax: example,
    commonFlags: fields,
    commonFields: fields,
    examples: [example],
    devOpsUseCase: `Useful for ${purpose} in infrastructure delivery, review, and operations.`,
    commonMistake: `Using ${command} without reviewing state, workspace, provider credentials, or the generated plan.`,
    relatedCommands: related,
    relatedConcepts: related,
    answers: [example],
  }));
}

export const terraformCategories = categoryDefinitions.map(([category]) => category);
export const terraformCommandCatalog = categoryDefinitions.flatMap(makeEntry);
export const terraformReference = terraformCategories.map((category) => ({
  category,
  commands: terraformCommandCatalog.filter((item) => item.category === category),
}));

export const terraformFlashcards = terraformCommandCatalog.map((item, index) => ({
  id: index === 0 ? "tf-fc-iac" : `tf-fc-${index + 1}`,
  category: item.category,
  difficulty: item.difficulty,
  front: `What should you know about \`${item.command}\`?`,
  basicExplanation: item.basicExplanation,
  professionalExplanation: item.professionalExplanation,
  example: item.examples[0],
  useCase: item.devOpsUseCase,
  relatedConcepts: item.relatedCommands,
}));

export const terraformMultipleChoice = terraformCommandCatalog.map((item, index, catalog) => ({
  id: `tf-mcq-${index + 1}`,
  category: item.category,
  question: `Which Terraform topic or command best matches: ${item.basicExplanation.toLowerCase()}`,
  options: [
    item.command,
    catalog[(index + 13) % catalog.length].command,
    catalog[(index + 41) % catalog.length].command,
    catalog[(index + 79) % catalog.length].command,
  ],
  answer: 0,
  explanation: `\`${item.command}\`: ${item.professionalExplanation}`,
}));

export const terraformCommandQuiz = terraformCommandCatalog.map((item, index) => ({
  id: `tf-command-${index + 1}`,
  category: item.category,
  prompt: `Write a Terraform CLI command that demonstrates or inspects this topic: ${item.command}.`,
  answers: item.answers,
  explanation: `A valid workflow is \`${item.answers[0]}\`.`,
}));
