resource "google_cloud_run_service" "urldbot" {
  name     = "urldbot"
  location = "asia-east1"

  template {
    metadata {
      labels = {
        app   = "urldbot"
        image = "urldbot"
      }
      annotations = {
        "autoscaling.knative.dev/maxScale" = "4"
        "autoscaling.knative.dev/minScale" = "0"
      }
    }
    spec {
      containers {
        image = "asia-east1-docker.pkg.dev/crows-moe/images/urldbot:${var.deploy_tag}"
        env {
          name  = "URLDBOT_TOKEN"
          value = var.urldbot_token
        }
        env {
          name  = "URLDBOT_WEBHOOK_HOST"
          value = "urldbot.crows.moe"
        }
        ports {
          container_port = 8080
        }
      }
    }
  }
}

resource "google_cloud_run_domain_mapping" "urldbot" {
  location = google_cloud_run_service.urldbot.location
  name     = "urldbot.crows.moe"
  metadata {
    namespace = google_cloud_run_service.urldbot.project
  }
  spec {
    route_name = google_cloud_run_service.urldbot.name
  }
}

resource "google_cloud_run_service_iam_policy" "urldbot" {
  location = google_cloud_run_service.urldbot.location
  project  = google_cloud_run_service.urldbot.project
  service  = google_cloud_run_service.urldbot.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
