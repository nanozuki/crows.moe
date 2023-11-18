resource "google_cloud_run_service" "urldrbot" {
  name     = "urldrbot"
  location = "asia-east1"

  template {
    metadata {
      labels = {
        app   = "urldrbot"
        image = "urldrbot"
      }
      annotations = {
        "autoscaling.knative.dev/maxScale" = "4"
        "autoscaling.knative.dev/minScale" = "0"
      }
    }
    spec {
      containers {
        image = "asia-east1-docker.pkg.dev/crows-moe/images/urldrbot:${var.deploy_tag}"
        env {
          name  = "URLDRBOT_TOKEN"
          value = var.urldrbot_token
        }
        env {
          name  = "URLDRBOT_WEBHOOK_HOST"
          value = "urldrbot.crows.moe"
        }
        ports {
          container_port = 8080
        }
      }
    }
  }
}

resource "google_cloud_run_domain_mapping" "urldrbot" {
  location = google_cloud_run_service.urldrbot.location
  name     = "urldrbot.crows.moe"
  metadata {
    namespace = google_cloud_run_service.urldrbot.project
  }
  spec {
    route_name = google_cloud_run_service.urldrbot.name
  }
}

resource "google_cloud_run_service_iam_policy" "urldrbot" {
  location = google_cloud_run_service.urldrbot.location
  project  = google_cloud_run_service.urldrbot.project
  service  = google_cloud_run_service.urldrbot.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
