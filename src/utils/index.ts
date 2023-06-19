const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

export function firstLetterUpperCase(str: string) {
  return str[0] + str.substring(1).toLowerCase()
}

export function getMonthName(index: number) {
  return months[index]
}