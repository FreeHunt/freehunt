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

resource "aws_s3_bucket_versioning" "freehunt_avatar_versioning" {
  bucket = aws_s3_bucket.freehunt_avatar.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_cors_configuration" "freehunt_avatar_cors" {
  bucket = aws_s3_bucket.freehunt_avatar.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD", "OPTIONS"]
    allowed_origins = [var.frontend_url]
    expose_headers  = ["ETag"]
    max_age_seconds = var.max_age_seconds
  }
}

# Allow public read access to the bucket
resource "aws_s3_bucket_public_access_block" "freehunt_avatar_pab" {
  bucket = aws_s3_bucket.freehunt_avatar.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Bucket policy to allow public read access to objects
resource "aws_s3_bucket_policy" "freehunt_avatar_policy" {
  bucket = aws_s3_bucket.freehunt_avatar.id
  
  depends_on = [aws_s3_bucket_public_access_block.freehunt_avatar_pab]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.freehunt_avatar.arn}/*"
      }
    ]
  })
}
