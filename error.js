import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const errorRouter = express.Router();

// Handle 400 Bad Request
errorRouter.use((err, req, res, next) => {
    if (err.status === 400) {
        return res.status(400).sendFile(path.join(__dirname, 'public', '400.html'));
    }
    next(err);
});

// Handle 401 Unauthorized
errorRouter.use((err, req, res, next) => {
    if (err.status === 401) {
        return res.status(401).sendFile(path.join(__dirname, 'public', '401.html'));
    }
    next(err);
});

// Handle 403 Forbidden
errorRouter.use((err, req, res, next) => {
    if (err.status === 403) {
        return res.status(403).sendFile(path.join(__dirname, 'public', '403.html'));
    }
    next(err);
});

// Handle 404 Not Found
errorRouter.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Handle 500 Internal Server Error
errorRouter.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error stack
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

// Handle 502 Bad Gateway
errorRouter.use((err, req, res, next) => {
    if (err.status === 502) {
        return res.status(502).sendFile(path.join(__dirname, 'public', '502.html'));
    }
    next(err);
});

// Handle 503 Service Unavailable
errorRouter.use((err, req, res, next) => {
    if (err.status === 503) {
        return res.status(503).sendFile(path.join(__dirname, 'public', '503.html'));
    }
    next(err);
});

// Handle 504 Gateway Timeout
errorRouter.use((err, req, res, next) => {
    if (err.status === 504) {
        return res.status(504).sendFile(path.join(__dirname, 'public', '504.html'));
    }
    next(err);
});

export default errorRouter;
