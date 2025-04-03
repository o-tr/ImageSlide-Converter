let workerId = -1;

export const setWorkerId = (_workerId: number) => {
  workerId = _workerId;
};

export const getWorkerId = () => {
  return workerId;
};
