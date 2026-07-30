# Deploy Browser Tools to Amazon S3

The site can be exported as plain HTML, CSS, JavaScript, images, and text files.
Flask is used only while building the static files; it is not required on AWS.
All PDF, image, QR, hash, timer, calculator, and Path Studio operations continue
to run in the visitor's browser.

## Requirements

- Python with the packages in `requirements.txt`
- AWS CLI configured with permission to upload to the target bucket
- A dedicated S3 bucket
- The final HTTPS origin, normally a CloudFront or custom-domain URL

## Build for local preview

```powershell
python build_static.py
python -m http.server 8000 --directory s3-site
```

Open `http://localhost:8000`.

## Build with production SEO URLs

Replace the example address with the final CloudFront or custom-domain origin:

```powershell
python build_static.py --site-url https://tools.example.com
```

The generated site is written to `s3-site/`. The supplied site URL is embedded
in canonical tags, structured data, `robots.txt`, and `sitemap.xml`.

## Upload and configure S3 website hosting

```powershell
.\deploy_s3.ps1 `
  -Bucket your-dedicated-bucket-name `
  -SiteUrl https://tools.example.com `
  -Region ap-northeast-2
```

The script validates and builds the site, uploads it, explicitly assigns the
JavaScript MIME type to `.mjs` modules, and configures `index.html` and
`404.html`. It does not change Block Public Access, bucket policy, DNS, TLS, or
CloudFront settings.

The generated links use directory-style URLs such as `/pdf-split/`. Direct S3
website hosting supports these automatically. If CloudFront is added, use the
S3 website endpoint as the origin or add a CloudFront Function that appends
`index.html` to directory requests. For HTTPS, attach an ACM certificate and
point the supplied `SiteUrl` to the CloudFront distribution.

Do not deploy a local-preview build to production: it contains localhost
canonical and sitemap URLs. Run the production build again with the real public
origin before uploading.
