function fetchService<T = any>(url: string, options?: RequestInit): Promise<T> {
  // 设置默认的请求头
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  return new Promise((resolve, reject) => {
    fetch(url, finalOptions).then(response=>{
      if (!response.ok) {
        reject(`HTTP error! status: ${response.status}`);
      }
      resolve(response.json() as Promise<T>);
    }).catch(err=>{console.log(err);})
  })
}

export {fetchService};
