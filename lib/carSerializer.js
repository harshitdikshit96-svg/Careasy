/** Convert a DB Car record to the shape the frontend expects. */
export function serializeCar({ images, features, ...car }) {
  return {
    ...car,
    image: JSON.parse(images || "[]"), // frontend uses `image`
    features: JSON.parse(features || "[]"),
  };
}

/** Convert frontend/form data to DB shape. */
export function deserializeCar({ image, features, ...data }) {
  return {
    ...data,
    images: JSON.stringify(Array.isArray(image) ? image : [image].filter(Boolean)),
    features: JSON.stringify(Array.isArray(features) ? features : [features].filter(Boolean)),
  };
}
