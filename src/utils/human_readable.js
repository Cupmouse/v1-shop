const SI_SUFFIX = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

export const bytes = raw_size => {
  let hr = raw_size;
  let i = 0;

  for (; i < SI_SUFFIX.length; i++) {
    if (hr < 1024)
      break;
    hr /= 1024;
  }
  return Math.round(hr*100)/100 + SI_SUFFIX[i];
}
