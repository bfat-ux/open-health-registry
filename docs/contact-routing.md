# Production contact form routing

The OHR contact form submits to `/api/ohr/contact` on its own domain.

Within the existing HTTPS server block for openhealthregistry.org and
www.openhealthregistry.org, Nginx must include:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3003;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

The backend is in bfat-ux/bernardfatoye.com.
Its index.js registers ohr-contact.js for /api/ohr/contact.

OHR messages go to bernardfatoye@gmail.com with OHR labels,
organisation, and enquiry subject.
HTAPlus uses its separate backend on port 3000.

Keep email credentials in private environment configuration.
Never commit credentials.

Run sudo nginx -t before reloading Nginx.
Verify the contact form through the browser and confirm inbox delivery.
