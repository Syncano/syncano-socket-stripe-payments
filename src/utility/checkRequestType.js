const checkRequestMethodType = (requestMethod, expectedMethodTypes, actions) => {
  const expectedAsString = expectedMethodTypes.join(', ');
  if (!expectedAsString.includes(requestMethod)) {
    throw new Error(`Make sure to use ${expectedAsString} for ${actions}.`, 400);
  }
};

export default checkRequestMethodType;
