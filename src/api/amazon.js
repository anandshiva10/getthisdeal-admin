export const amazon = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'e5d0169c32msh099996de1099041p14eb94jsn2ec15ba39ffe',
      'X-RapidAPI-Host': 'amazon24.p.rapidapi.com'
    }
  };

  export const fetchData = async(url, options) =>{
    const res = await fetch(url, options);
    const data = await res.json();

    return data
}