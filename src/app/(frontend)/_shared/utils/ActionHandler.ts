export function ActionHandler(action, arg) {
  return action(arg)
    .then((res) => {
      if ("error" in res) {
        throw new Error(res.message);
      }
      return res.data;
    })
    .catch((error) => {
      throw new Error(error);
    });
}
