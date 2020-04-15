export const formatDate = (taskDate) => {
    const date = new Date(taskDate);
    return date.getMonth() + "/" + date.getDate() + ", " + date.getHours() + ":" + date.getMinutes();
  };
