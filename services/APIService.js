export const joinRoom = async (options) => {
  try {
    const params = new URLSearchParams(options);
    const res = await fetch(`/api/room?${params}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createRoom = async (options) => {
  try {
    const res = await fetch("/api/room", {
      method: "POST",
      body: JSON.stringify(options),
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
