provider "google" {
  project = "crows-moe"
  region  = "asia-east1"
  zone    = "asia-east1-a"
}

resource "google_firestore_database" "database" {
  name                        = "(default)"
  location_id                 = "asia-east1"
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"
}

resource "google_artifact_registry_repository" "images" {
  repository_id = "images"
  format        = "DOCKER"
  location      = "asia-east1"
  description   = "default docker repository"
}

resource "google_cloud_run_service" "mediavote-api" {
  name     = "mediavote-api"
  location = "asia-east1"

  template {
    metadata {
      labels = {
        app   = "mediavote"
        image = "mediavote-api"
      }
    }
    spec {
      containers {
        image = "asia-east1-docker.pkg.dev/crows-moe/images/mediavote-api:1.0.1"
        env {
          name  = "MEDIAVOTE_ENV"
          value = "production"
        }
        ports {
          container_port = 8080
        }
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.mediavote-api.location
  project  = google_cloud_run_service.mediavote-api.project
  service  = google_cloud_run_service.mediavote-api.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
