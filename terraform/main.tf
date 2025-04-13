terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  
  /*
  backend "s3" {
    bucket = "mcp-terraform-state"
    key    = "terraform.tfstate"
    region = "ap-southeast-2"
  }
  */
}

provider "aws" {
  region = "ap-southeast-2"
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr           = "10.0.0.0/16"
  environment        = "production"
  project_name       = "mcp"
  availability_zones = ["ap-southeast-2a", "ap-southeast-2b", "ap-southeast-2c"]
  private_subnets    = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

# Security Module
module "security" {
  source = "./modules/security"
  
  vpc_id       = module.vpc.vpc_id
  environment  = "production"
  project_name = "mcp"
}

# EC2 Module
module "ec2" {
  source = "./modules/ec2"
  
  vpc_id              = module.vpc.vpc_id
  public_subnet_ids   = module.vpc.public_subnet_ids
  security_group_id   = module.security.ec2_security_group_id
  environment         = "production"
  project_name        = "mcp"
  instance_type       = "t3.micro"
  key_name            = "react-key-pair"
} 