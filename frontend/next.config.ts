const NodeURL = require('url').URL;

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  console.error('Error: NEXT_PUBLIC_BACKEND_URL no está definida en tus variables de entorno.');
}

let imagesRemotePatterns = [];

if (backendUrl) {
  try {
    const parsedBackendUrl = new NodeURL(backendUrl); 
    imagesRemotePatterns.push({
      protocol: parsedBackendUrl.protocol.replace(':', ''),
      hostname: parsedBackendUrl.hostname,
      port: parsedBackendUrl.port || '', 
      pathname: '/uploads/usuarios/**', 
    });
  } catch (error) {
    console.error(`Error al parsear NEXT_PUBLIC_BACKEND_URL: ${backendUrl}`, error);
  }
}


const nextConfig = {
  images: {
    remotePatterns: [
      ...imagesRemotePatterns,
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
