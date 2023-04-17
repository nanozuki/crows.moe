resource "google_cloud_run_service" "mediavote-web" {
  name     = "mediavote-web"
  location = "asia-east1"

  template {
    metadata {
      labels = {
        app   = "mediavote"
        image = "mediavote-web"
      }
      annotations = {
        "autoscaling.knative.dev/maxScale" = "4"
        "autoscaling.knative.dev/minScale" = "0"
      }
    }
    spec {
      containers {
        image = "asia-east1-docker.pkg.dev/crows-moe/images/mediavote-web:${var.deploy_tag}"
        ports {
          container_port = 3000
        }
      }
    }
  }
}

resource "google_cloud_run_domain_mapping" "mediavote-web" {
  location = google_cloud_run_service.mediavote-web.location
  name     = "mediavote.crows.moe"
  metadata {
    namespace = google_cloud_run_service.mediavote-web.project
  }
  spec {
    route_name = google_cloud_run_service.mediavote-web.name
  }
}

resource "google_cloud_run_service_iam_policy" "mediavote-web" {
  location = google_cloud_run_service.mediavote-web.location
  project  = google_cloud_run_service.mediavote-web.project
  service  = google_cloud_run_service.mediavote-web.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
