use once_cell::sync::Lazy;
use regex::Regex;
use url::form_urlencoded;
use url::Url;

pub struct DoctorReply {
    pub title: String,
    pub url: String,
}

async fn _cure_url(url: Url) -> Result {
    cure_b23(url.clone()).await?;
    cure_bilibili(url.clone()).await?;
    cure_twitter(url.clone()).await?;
    cure_xhslink(url.clone()).await?;
    cure_youtu_dot_be(url.clone()).await?;
    return Ok(());
}

pub async fn cure_url(url: Url) -> Vec<DoctorReply> {
    match _cure_url(url).await {
        Ok(_) => vec![],
        Err(replies) => replies,
    }
}

static REDIRECT_HREF_RE: Lazy<Regex> =
    Lazy::new(|| Regex::new(r#"href="(https://[^"<>]*)"#).unwrap());

async fn get_redirect_href(u: Url) -> Option<Url> {
    let client = reqwest::Client::builder()
        .user_agent("curl/8.1.2")
        .redirect(reqwest::redirect::Policy::none())
        .build()
        .unwrap();
    let res = client.get(u).send().await.unwrap();
    let ress = res.text().await.unwrap();
    let addresses = REDIRECT_HREF_RE.find(&ress).map(|m| m.as_str());
    if let Some(address) = addresses {
        let u = Url::parse(address).unwrap();
        return Some(u);
    }
    return None;
}

async fn clean_url(url: Url) -> Vec<DoctorReply> {
    let result = format!(
        "{}://{}{}",
        url.scheme(),
        url.host_str().unwrap(),
        url.path()
    );
    return vec![DoctorReply {
        title: "Clean URL".to_string(),
        url: result,
    }];
}

type Result = std::result::Result<(), Vec<DoctorReply>>;

async fn cure_b23(url: Url) -> Result {
    if url.host_str() != Some("b23.tv") {
        return Ok(());
    }
    let u = match get_redirect_href(url.clone()).await {
        Some(u) => u,
        None => return Ok(()),
    };
    let target = format!("https://{}{}", u.host_str().unwrap(), u.path());
    Err(vec![DoctorReply {
        title: "Bilibili".to_string(),
        url: target.to_string(),
    }])
}

async fn cure_bilibili(url: Url) -> Result {
    if url.host_str() != Some("bilibili.com") {
        return Ok(());
    }
    Err(clean_url(url).await)
}

async fn cure_twitter(url: Url) -> Result {
    if url.host_str() != Some("twitter.com") && url.host_str() != Some("x.com") {
        return Ok(());
    }
    let path = url.path().trim_start_matches("/");
    let parts: Vec<&str> = path.split('/').collect();
    if parts.len() != 3 || parts[1] != "status" {
        return Ok(());
    }
    let fx_twitter = "https://fxtwitter.com/";
    let fx_twitter = if url.host_str() == Some("x.com") {
        "https://fixupx.com/"
    } else {
        fx_twitter
    };
    Err(vec![
        DoctorReply {
            title: "FxTwitter".to_string(),
            url: format!("{}{}", fx_twitter, path),
        },
        DoctorReply {
            title: "VxTwitter".to_string(),
            url: format!("https://vxtwitter.com/{}", path),
        },
    ])
}

async fn cure_xhslink(url: Url) -> Result {
    if url.host_str() != Some("xhslink.com") {
        return Ok(());
    }
    let u = match get_redirect_href(url.clone()).await {
        Some(u) => u,
        None => return Ok(()),
    };
    let target = format!("https://{}{}", u.host_str().unwrap(), u.path());
    Err(vec![DoctorReply {
        title: "小红书".to_string(),
        url: target.to_string(),
    }])
}

async fn cure_youtu_dot_be(url: Url) -> Result {
    if url.host_str() != Some("youtu.be") {
        return Ok(());
    }
    let query = url.query_pairs();
    let mut new_query = form_urlencoded::Serializer::new(String::new());
    new_query.append_pair("v", url.path().trim_start_matches("/"));
    for (k, v) in query {
        if k == "t" {
            new_query.append_pair("t", &v);
            break;
        }
    }
    let new_url = format!("https://youtube.com/watch?{}", new_query.finish());
    Err(vec![DoctorReply {
        title: "Youtube".to_string(),
        url: new_url,
    }])
}
