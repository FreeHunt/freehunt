terraform {
  cloud {
    organization = "FreeHunt"

    workspaces {
      name = "production"
    }
  }

  required_version = "~>1.12.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0-beta3"
    }
  }
}
