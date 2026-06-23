import { terraformRules as t } from "../utils/terraformValidation.js";

function task(id, title, filename, instruction, solution, rules, explanation) {
  return { id, title, filename, instruction, starter: "", solution, rules, explanation };
}

export const terraformExtraPractice = [
  task(
    "tf-hcl-depends-on", "Explicit depends_on", "main.tf",
    "Add depends_on to aws_instance.web so it waits for aws_security_group.web.",
    'resource "aws_instance" "web" {\n  ami           = "ami-123456"\n  instance_type = "t3.micro"\n  depends_on    = [aws_security_group.web]\n}\n',
    [t.resource("aws_instance", "web"), t.attributePresent("depends_on"), t.reference("aws_security_group.web")],
    "depends_on is used only when Terraform cannot infer an ordering relationship from references.",
  ),
  task(
    "tf-hcl-vpc", "VPC resource", "network.tf",
    "Create aws_vpc.main with cidr_block 10.0.0.0/16 and Name tag main.",
    'resource "aws_vpc" "main" {\n  cidr_block = "10.0.0.0/16"\n\n  tags = {\n    Name = "main"\n  }\n}\n',
    [t.resource("aws_vpc", "main"), t.attribute("cidr_block", "10.0.0.0/16"), t.requiredString("Name tag", "Name"), t.requiredString("main tag value", "main")],
    "A VPC establishes the private network boundary for AWS resources.",
  ),
  task(
    "tf-hcl-subnet", "Subnet resource", "network.tf",
    "Create aws_subnet.public using aws_vpc.main.id, CIDR 10.0.1.0/24, and availability zone us-east-1a.",
    'resource "aws_subnet" "public" {\n  vpc_id            = aws_vpc.main.id\n  cidr_block        = "10.0.1.0/24"\n  availability_zone = "us-east-1a"\n}\n',
    [t.resource("aws_subnet", "public"), t.reference("aws_vpc.main.id"), t.attribute("cidr_block", "10.0.1.0/24"), t.attribute("availability_zone", "us-east-1a")],
    "Subnets carve address space from a VPC and bind it to an availability zone.",
  ),
  task(
    "tf-hcl-igw", "Internet gateway", "network.tf",
    "Create aws_internet_gateway.main attached to aws_vpc.main.id.",
    'resource "aws_internet_gateway" "main" {\n  vpc_id = aws_vpc.main.id\n}\n',
    [t.resource("aws_internet_gateway", "main"), t.reference("aws_vpc.main.id")],
    "An internet gateway is required for public IPv4 internet routes from a VPC.",
  ),
  task(
    "tf-hcl-route-table", "Public route table", "routes.tf",
    "Create aws_route_table.public for aws_vpc.main.id with default route 0.0.0.0/0 through aws_internet_gateway.main.id.",
    'resource "aws_route_table" "public" {\n  vpc_id = aws_vpc.main.id\n\n  route {\n    cidr_block = "0.0.0.0/0"\n    gateway_id = aws_internet_gateway.main.id\n  }\n}\n',
    [t.resource("aws_route_table", "public"), t.reference("aws_vpc.main.id"), t.block("route"), t.attribute("cidr_block", "0.0.0.0/0"), t.reference("aws_internet_gateway.main.id")],
    "A route table controls how subnet traffic leaves the VPC.",
  ),
  task(
    "tf-hcl-sg-rule", "Security group rule", "security.tf",
    "Create aws_security_group_rule.http allowing ingress TCP 80 from 0.0.0.0/0 on aws_security_group.web.id.",
    'resource "aws_security_group_rule" "http" {\n  type              = "ingress"\n  security_group_id = aws_security_group.web.id\n  from_port         = 80\n  to_port           = 80\n  protocol          = "tcp"\n  cidr_blocks       = ["0.0.0.0/0"]\n}\n',
    [t.resource("aws_security_group_rule", "http"), t.attribute("type", "ingress"), t.reference("aws_security_group.web.id"), t.attribute("from_port", 80), t.attribute("to_port", 80), t.attribute("protocol", "tcp"), t.requiredString("CIDR 0.0.0.0/0", "0.0.0.0/0")],
    "Standalone security group rules are useful when rule lifecycle needs to be managed separately.",
  ),
  task(
    "tf-hcl-iam-role", "IAM role", "iam.tf",
    "Create aws_iam_role.ec2_role with an assume_role_policy for ec2.amazonaws.com.",
    'resource "aws_iam_role" "ec2_role" {\n  name = "ec2-role"\n\n  assume_role_policy = jsonencode({\n    Version = "2012-10-17"\n    Statement = [{\n      Action = "sts:AssumeRole"\n      Effect = "Allow"\n      Principal = { Service = "ec2.amazonaws.com" }\n    }]\n  })\n}\n',
    [t.resource("aws_iam_role", "ec2_role"), t.attribute("name", "ec2-role"), t.attributePresent("assume_role_policy"), t.requiredString("sts assume role", "sts:AssumeRole"), t.requiredString("EC2 service principal", "ec2.amazonaws.com")],
    "IAM roles define trusted principals and are later attached to policies or instance profiles.",
  ),
  task(
    "tf-hcl-policy-attachment", "IAM policy attachment", "iam.tf",
    "Attach AmazonSSMManagedInstanceCore to aws_iam_role.ec2_role with aws_iam_role_policy_attachment.ssm.",
    'resource "aws_iam_role_policy_attachment" "ssm" {\n  role       = aws_iam_role.ec2_role.name\n  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"\n}\n',
    [t.resource("aws_iam_role_policy_attachment", "ssm"), t.reference("aws_iam_role.ec2_role.name"), t.requiredString("SSM policy ARN", "AmazonSSMManagedInstanceCore"), t.attributePresent("policy_arn")],
    "Policy attachments connect IAM permissions to a role without embedding inline policy JSON.",
  ),
  task(
    "tf-hcl-eks-module", "EKS module usage", "eks.tf",
    "Call module eks from terraform-aws-modules/eks/aws version 20.0.0 with cluster_name lab and vpc_id module.vpc.vpc_id.",
    'module "eks" {\n  source  = "terraform-aws-modules/eks/aws"\n  version = "20.0.0"\n\n  cluster_name = "lab"\n  vpc_id       = module.vpc.vpc_id\n}\n',
    [t.module("eks"), t.attribute("source", "terraform-aws-modules/eks/aws"), t.attribute("version", "20.0.0"), t.attribute("cluster_name", "lab"), t.reference("module.vpc.vpc_id")],
    "Registry modules should be version-pinned and wired to network outputs.",
  ),
  task(
    "tf-hcl-remote-state", "Remote state data source", "remote-state.tf",
    "Read VPC outputs from an S3 terraform_remote_state data source named network.",
    'data "terraform_remote_state" "network" {\n  backend = "s3"\n\n  config = {\n    bucket = "company-tf-state"\n    key    = "network/terraform.tfstate"\n    region = "us-east-1"\n  }\n}\n',
    [t.data("terraform_remote_state", "network"), t.attribute("backend", "s3"), t.attributePresent("config", "config map"), t.attribute("bucket", "company-tf-state"), t.attribute("key", "network/terraform.tfstate"), t.attribute("region", "us-east-1")],
    "terraform_remote_state reads outputs from another root module's state snapshot.",
  ),
  task(
    "tf-hcl-tfvars", "tfvars example", "dev.tfvars",
    "Write a tfvars file setting instance_type to t3.micro and environment to dev.",
    'instance_type = "t3.micro"\nenvironment   = "dev"\n',
    [t.attribute("instance_type", "t3.micro"), t.attribute("environment", "dev")],
    "tfvars files supply environment-specific variable values outside module code.",
  ),
  task(
    "tf-hcl-sensitive-variable", "Sensitive variable", "variables.tf",
    "Declare sensitive string variable db_password with no default.",
    'variable "db_password" {\n  description = "Database password"\n  type        = string\n  sensitive   = true\n}\n',
    [t.variable("db_password"), t.attributePresent("description"), t.attributePresent("type"), t.attribute("sensitive", true)],
    "sensitive redacts normal CLI display, but state still needs secure storage.",
  ),
  task(
    "tf-hcl-complete-ec2", "Complete small EC2 project", "main.tf",
    "Write a small EC2 configuration with AWS provider, aws_security_group.web, aws_instance.web, and output instance_ip.",
    'provider "aws" {\n  region = "us-east-1"\n}\n\nresource "aws_security_group" "web" {\n  name = "web"\n}\n\nresource "aws_instance" "web" {\n  ami                    = "ami-123456"\n  instance_type          = "t3.micro"\n  vpc_security_group_ids = [aws_security_group.web.id]\n}\n\noutput "instance_ip" {\n  value = aws_instance.web.public_ip\n}\n',
    [t.provider("aws"), t.resource("aws_security_group", "web"), t.resource("aws_instance", "web"), t.attribute("ami", "ami-123456"), t.attribute("instance_type", "t3.micro"), t.reference("aws_security_group.web.id"), t.output("instance_ip"), t.reference("aws_instance.web.public_ip")],
    "A small project combines provider configuration, network permissions, compute, and useful output.",
  ),
  task(
    "tf-hcl-backend-complete", "Complete backend configuration", "backend.tf",
    "Write a complete S3 backend with bucket, key, region, encrypt true, and DynamoDB locking table.",
    'terraform {\n  backend "s3" {\n    bucket         = "company-tf-state"\n    key            = "prod/app/terraform.tfstate"\n    region         = "us-east-1"\n    encrypt        = true\n    dynamodb_table = "terraform-locks"\n  }\n}\n',
    [t.block("terraform"), t.backend("s3"), t.attribute("bucket", "company-tf-state"), t.attribute("key", "prod/app/terraform.tfstate"), t.attribute("region", "us-east-1"), t.attribute("encrypt", true), t.attribute("dynamodb_table", "terraform-locks")],
    "A backend configuration should cover durable storage, encryption, and locking.",
  ),
  task(
    "tf-hcl-workspace-pattern", "Workspace naming pattern", "locals.tf",
    "Use terraform.workspace in locals to build name_prefix app-${terraform.workspace}.",
    'locals {\n  name_prefix = "app-${terraform.workspace}"\n}\n',
    [t.block("locals"), t.attributePresent("name_prefix"), t.reference("terraform.workspace")],
    "Workspace-aware names can separate resources when one configuration uses multiple state instances.",
  ),
  task(
    "tf-hcl-module-vars-outputs", "Reusable module variables and outputs", "modules/web/outputs.tf",
    "Write module input variable name and output instance_id referencing aws_instance.this.id.",
    'variable "name" {\n  type = string\n}\n\noutput "instance_id" {\n  value = aws_instance.this.id\n}\n',
    [t.variable("name"), t.attributePresent("type"), t.output("instance_id"), t.reference("aws_instance.this.id")],
    "Reusable modules need clear inputs and outputs as their public interface.",
  ),
];
