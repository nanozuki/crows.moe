resource "google_cloud_run_service" "ema" {
  name     = "ema"
  location = "asia-southeast1"

  template {
    metadata {
      labels = {
        app   = "ema"
        image = "ema"
      }
      annotations = {
        "autoscaling.knative.dev/maxScale" = "4"
        "autoscaling.knative.dev/minScale" = "0"
      }
    }
    spec {
      containers {
        image = "asia-southeast1-docker.pkg.dev/crows-moe/images/ema:${var.deploy_tag}"
        ports {
          container_port = 3000
        }
      }
    }
  }
}

resource "google_cloud_run_domain_mapping" "ema" {
  location = google_cloud_run_service.ema.location
  name     = "ema.crows.moe"
  metadata {
    namespace = google_cloud_run_service.ema.project
  }
  spec {
    route_name = google_cloud_run_service.ema.name
  }
}

resource "google_cloud_run_service_iam_policy" "ema" {
  location = google_cloud_run_service.ema.location
  project  = google_cloud_run_service.ema.project
  service  = google_cloud_run_service.ema.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
