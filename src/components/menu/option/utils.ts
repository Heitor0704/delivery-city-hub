
export function groupAndSortOptionsByLevel(options: any[], selectedLevel: string) {
  const filteredOptions = selectedLevel && selectedLevel !== 'all'
    ? options.filter(option => option.nivel === selectedLevel)
    : options;

  const groupedOptions = filteredOptions.reduce((result, item) => {
    if (!result[item.nivel]) {
      result[item.nivel] = [];
    }
    result[item.nivel].push(item);
    return result;
  }, {} as Record<string, any[]>);

  Object.keys(groupedOptions).forEach(level => {
    groupedOptions[level].sort((a, b) => a.ordem - b.ordem);
  });

  return Object.values(groupedOptions).flat();
}
