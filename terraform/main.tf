provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project = "freehunt"
      Owner   = "freehunt"
    }
  }
}

resource "aws_s3_bucket" "freehunt_avatar" {
  bucket        = var.freehunt_avatar_bucket_name
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "versioning_example" {
  bucket = aws_s3_bucket.freehunt_avatar.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_cors_configuration" "freehunt_avatar_cors" {
  bucket = aws_s3_bucket.freehunt_avatar.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = [var.frontend_url]
  }
}
