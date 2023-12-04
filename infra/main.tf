terraform {
  backend "remote" {
    organization = "crows-moe"
    workspaces {
      name = "crows-moe"
    }
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

variable "deploy_tag" {
  type = string
}

variable "urldbot_token" {
  type      = string
  sensitive = true
}

provider "google" {
  project = "crows-moe"
  region  = "asia-southeast1"
  zone    = "asia-southeast1-a"
}

# resource "google_firestore_database" "database" {
#   name                        = "exodus-media-awards"
#   location_id                 = "asia-southeast1"
#   type                        = "FIRESTORE_NATIVE"
#   concurrency_mode            = "OPTIMISTIC"
#   app_engine_integration_mode = "DISABLED"
#   lifecycle {
#     prevent_destroy = true
#   }
# }

resource "google_artifact_registry_repository" "images" {
  repository_id = "images"
  format        = "DOCKER"
  location      = "asia-southeast1"
  description   = "default docker repository"
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}
