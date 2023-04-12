resource "google_cloud_run_service" "mediavote-api" {
  name     = "mediavote-api"
  location = "asia-east1"

  template {
    metadata {
      labels = {
        app   = "mediavote"
        image = "mediavote-api"
      }
      annotations = {
        "autoscaling.knative.dev/maxScale" = "4"
        "autoscaling.knative.dev/minScale" = "0"
      }
    }
    spec {
      containers {
        image = "asia-east1-docker.pkg.dev/crows-moe/images/mediavote-api:1.1.1"
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

resource "google_cloud_run_domain_mapping" "mediavote-api" {
  location = google_cloud_run_service.mediavote-api.location
  name     = "api.crows.moe"
  metadata {
    namespace = google_cloud_run_service.mediavote-api.project
  }
  spec {
    route_name = google_cloud_run_service.mediavote-api.name
  }
}

resource "google_cloud_run_service_iam_policy" "mediavote-api" {
  location = google_cloud_run_service.mediavote-api.location
  project  = google_cloud_run_service.mediavote-api.project
  service  = google_cloud_run_service.mediavote-api.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
