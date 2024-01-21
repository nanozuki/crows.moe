resource "google_cloud_run_service" "ema-next" {
  name     = "ema-next"
  location = "asia-southeast1"

  template {
    metadata {
      labels = {
        app   = "ema-next"
        image = "ema-next"
      }
      annotations = {
        "autoscaling.knative.dev/maxScale" = "4"
        "autoscaling.knative.dev/minScale" = "0"
      }
    }
    spec {
      containers {
        image = "asia-southeast1-docker.pkg.dev/crows-moe/images/ema-next:${var.deploy_tag}"
        env {
          name  = "ORIGIN"
          value = "https://ema-next.crows.moe"
        }
        env {
          name  = "EMA_INVITE_KEY"
          value = var.ema_invite_key
        }
        env {
          name  = "EMA_JWT_SECRET"
          value = var.ema_jwt_secret
        }
        env {
          name  = "EMA_POSTGRES_URL"
          value = var.ema_postgres_url
        }
        ports {
          container_port = 3000
        }
      }
    }
  }
}

resource "google_cloud_run_domain_mapping" "ema-next" {
  location = google_cloud_run_service.ema-next.location
  name     = "ema-next.crows.moe"
  metadata {
    namespace = google_cloud_run_service.ema-next.project
  }
  spec {
    route_name = google_cloud_run_service.ema-next.name
  }
}

resource "google_cloud_run_service_iam_policy" "ema-next" {
  location = google_cloud_run_service.ema-next.location
  project  = google_cloud_run_service.ema-next.project
  service  = google_cloud_run_service.ema-next.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
