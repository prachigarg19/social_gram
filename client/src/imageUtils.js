//extract images
const fetchImage = async (fileName, token) => {
  const imageResponse = await fetch(
    `http://localhost:8800/api/images/${fileName}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (imageResponse.ok) {
    const imageBlob = await imageResponse.blob();
    return URL.createObjectURL(imageBlob);
  } else {
    return null;
  }
};

export default fetchImage;
