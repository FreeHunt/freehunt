output "aws_region" {
  description = "AWS region where resources are deployed"
  value       = var.aws_region
}

output "s3_bucket_arn" {
  description = "ARN of the avatar S3 bucket"
  value       = aws_s3_bucket.freehunt_avatar.arn
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for storing avatars"
  value       = aws_s3_bucket.freehunt_avatar.id
}

# S3 endpoint URL for S3_URL environment variable
output "s3_endpoint_url" {
  description = "S3 endpoint URL to use as MINIO_URL in production (regional endpoint)"
  value       = "https://${aws_s3_bucket.freehunt_avatar.bucket_regional_domain_name}"
}
