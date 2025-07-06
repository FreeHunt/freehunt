variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "eu-west-3"
}

variable "freehunt_avatar_bucket_name" {
  description = "The name of the S3 bucket for storing user avatars"
  type        = string
  default     = "freehunt-avatar"
}

variable "frontend_url" {
  description = "The URL of the frontend application in production"
  type        = string
  default     = "https://freehunt.fr"
}

variable "max_age_seconds" {
  description = "The maximum age for CORS preflight requests"
  type        = number
  default     = 3000
}