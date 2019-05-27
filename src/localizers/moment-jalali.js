import { DateLocalizer } from '../localizer'
import jMoment from 'moment-jalali'

let dateRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, 'L', culture) + ' — ' + local.format(end, 'L', culture)

let timeRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, 'LT', culture) + ' — ' + local.format(end, 'LT', culture)

let timeRangeStartFormat = ({ start }, culture, local) =>
  local.format(start, 'LT', culture) + ' — '

let timeRangeEndFormat = ({ end }, culture, local) =>
  ' — ' + local.format(end, 'LT', culture)

let weekRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, 'jDD jMMMM', culture) +
  ' - ' +
  local.format(end, month(start) === month(end) ? 'jDD' : 'jDD jMMMM', culture)

let firstVisibleDay = date => {
  const moment = jMoment(date)
  let firstOfMonth = moment.startOf('jMonth').startOf('week')
  return firstOfMonth.toDate()
}

let lastVisibleDay = date => {
  const moment = jMoment(date)
  let firstOfMonth = moment.endOf('jMonth').endOf('week')
  return firstOfMonth.toDate()
}

let month = (date, args) => {
  const moment = jMoment(date)
  if (args) {
    return moment.jMonth(args).toDate()
  } else {
    return moment.jMonth(args)
  }
}

export let formats = {
  dateFormat: 'jDD',
  dayFormat: 'dddd jDD',
  weekdayFormat: 'dddd',

  selectRangeFormat: timeRangeFormat,
  eventTimeRangeFormat: timeRangeFormat,
  eventTimeRangeStartFormat: timeRangeStartFormat,
  eventTimeRangeEndFormat: timeRangeEndFormat,

  timeGutterFormat: 'LT',

  monthHeaderFormat: 'jMMMM jYYYY',
  dayHeaderFormat: 'dddd jDD jMMMM',
  dayRangeHeaderFormat: weekRangeFormat,
  agendaHeaderFormat: dateRangeFormat,

  agendaDateFormat: 'dddd jDD jMMMM',
  agendaTimeFormat: 'LT',
  agendaTimeRangeFormat: timeRangeFormat,
}

export default function() {
  let locale = (m, c) => (c ? m.locale(c) : m)
  jMoment.loadPersian({ dialect: 'persian-modern' })
  return new DateLocalizer({
    formats,
    dates: { firstVisibleDay, lastVisibleDay, month },
    firstOfWeek(culture) {
      let data = culture ? jMoment.localeData(culture) : jMoment.localeData()
      return data ? data.firstDayOfWeek() : 6
    },

    format(value, format, culture) {
      return locale(jMoment(value), culture).format(format)
    },
  })
}
