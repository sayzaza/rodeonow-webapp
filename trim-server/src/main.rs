use std::io;

use actix_cors::Cors;
use actix_easy_multipart::{
    tempfile::Tempfile, text::Text, MultipartForm, MultipartForm as FromMultipart,
};
use actix_files::NamedFile;
use actix_web::{post, App, HttpServer};

#[derive(Debug, FromMultipart)]
struct Upload {
    start: Text<f64>,
    end: Text<f64>,
    file: Tempfile,
}

#[post("/")]
async fn index(upload: MultipartForm<Upload>) -> io::Result<NamedFile> {
    let Upload { start, end, file } = upload.0;

    // setup command
    let t_out = temp_file::TempFileBuilder::new().suffix(".mp4").build()?;
    let mut command = async_process::Command::new("ffmpeg");
    command
        .arg("-y")
        .arg("-i")
        .arg(file.file.path())
        .arg("-ss")
        .arg(format!("{}", start.0))
        .arg("-to")
        .arg(format!("{}", end.0))
        .arg("-c")
        .arg("copy")
        .arg("-c:v")
        .arg("libx265")
        .arg("-crf")
        .arg("20")
        .arg(t_out.path());

    // log
    println!("Running command: {command:?}");

    // execute
    let Ok(output) = command.output().await else {
        return Err(io::Error::new( io::ErrorKind::Other, "ffmpeg failed to execute" ));
    };

    // check for errors
    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        let report = format!(
            "ffmpeg failed with status code: {};\nError: {error}",
            output.status
        );

        return Err(io::Error::new(io::ErrorKind::Other, report));
    }

    // Stream file back down to user
    println!("Completed successfully!: {}", unsafe {
        std::str::from_utf8_unchecked(&output.stdout)
    });

    let t_file = actix_files::NamedFile::open_async(t_out.path()).await?;
    Ok(t_file)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = {
            #[cfg(debug_assertions)]
            {
                Cors::permissive()
            }
            #[cfg(not(debug_assertions))]
            {
                Cors::default()
                    .allowed_origin_fn(|origin, _| origin.as_bytes().ends_with(b"rodeonow.com"))
                    .allowed_methods(["GET", "POST"])
            }
        };

        App::new().wrap(cors).service(index)
    })
    .bind(("127.0.0.1", 3000))?
    .run()
    .await
}
