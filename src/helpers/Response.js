const serverError = (response, err = "") =>
  response.status(500).json({
    status: 500,
    error: err || "Something went wrong. Try again later",
  });
const serverResponse = (
  res,
  status,
  ...[statusKey, statusResult, msgkey, message, Key, Value]
) =>
  res.status(status).json({
    [statusKey]: statusResult,
    [msgkey]: message,
    [Key]: Value,
  });
const authResponse = (
  res,
  status,
  ...[statusKey, statusResult, msgkey, message, Key, Value]
) =>
  res.status(status).json({
    [statusKey]: statusResult,
    [msgkey]: message,
    [Key]: Value,
  });
const userResponse = (
  res,
  status,
  ...[statusKey, statusResult, msgkey, message, Key, Value]
) =>
  res.status(status).json({
    [statusKey]: statusResult,
    [msgkey]: message,
    [Key]: Value,
  });

export { userResponse, authResponse, serverResponse, serverError };
