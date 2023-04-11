resource "google_cloud_run_service" "blog" {
  name     = "blog"
  location = "asia-east1"

  template {
    metadata {
      labels = {
        app   = "blog"
        image = "blog"
      }
      annotations = {
        "autoscaling.knative.dev/maxScale" = "4"
        "autoscaling.knative.dev/minScale" = "0"
      }
    }
    spec {
      containers {
        image = "asia-east1-docker.pkg.dev/crows-moe/images/blog:1.0.0"
        ports {
          container_port = 80
        }
      }
    }
  }
}

resource "google_cloud_run_service_iam_policy" "blog" {
  location = google_cloud_run_service.blog.location
  project  = google_cloud_run_service.blog.project
  service  = google_cloud_run_service.blog.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
