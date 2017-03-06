import dateFormat from '../../libs/dateformat.js'
const ONE_DAY = 24 * 60 * 60 * 1000
import dispatch from '../../mixins/_dispatch.js'

const AuDatePickerContent = Vue.extend({
  template: require('./_date-picker-content.jade'),
  mixins: [dispatch],
  props: {
    value: {
      type: Date,
      default () {
        return new Date()
      }
    },
    range: {
      type: Array,
      default () {
        return null
      }
    },
    leftRange: Boolean,
    rightRange: Boolean
  },
  data () {
    return {
      tempValue: new Date(this.value),
      mouseoverValue: null
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    },
    year () {
      return dateFormat(this.tempValue, 'yyyy')
    },
    month () {
      return dateFormat(this.tempValue, 'mm')
    },
    days () {
      this.tempValue
      this.mouseoverValue

      var value = new Date(this.tempValue)
      var currentMonth = value.getMonth()
      var i, j

      value.setDate(1)

      var week = value.getDay() // 周几 0表示周日
      value = new Date(+value - ONE_DAY * week)
      var days = [] // this.days对象

      for (i = 0; i < 6; i++) {
        days.push([])

        for (j = 0; j < 7; j++) {
          days[i].push(this.getDay(value, currentMonth === value.getMonth()))
          value = new Date(+value + ONE_DAY)
        }
      }

      return days
    }
  },
  created () {
    this.$on('mouseover.item.datePickerContent', (value) => {
      this.mouseoverValue = value
    })
  },
  methods: {
    reset () {
      this.mouseoverValue = null
      this.tempValue = new Date(this.value)
    },
    clickItem (value) {
      this.mouseoverValue = null
      this.model = value

      if (this.range) {
        this.$emit('click.range', value)
      }
    },
    mouseoverItem (value) {
      this.dispatch('mouseover.item.datePickerContent', value)
    },
    prevYear () {
      this.tempValue.setFullYear(this.tempValue.getFullYear() - 1)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    },
    prevMonth () {
      this.tempValue.setMonth(this.tempValue.getMonth() - 1)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    },
    nextYear () {
      this.tempValue.setFullYear(this.tempValue.getFullYear() + 1)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    },
    nextMonth () {
      this.tempValue.setMonth(this.tempValue.getMonth() + 1)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    },
    getDay (value, isCurrentMonth) {
      const result = {
        value,
        isCurrentMonth,
        date: value.getDate(),
        month: value.getMonth() + 1,
        isToday: this.isToday(value),
        isCurrentDate: this.isCurrentDate(value)
      }

      if (this.range) {
        const start = this.range[0]
        const end = this.range[1]

        if (start && this.isEqualDate(value, start)) {
          result.isRangeStart = true
        }

        if (end && this.isEqualDate(value, end)) {
          result.isRangeEnd = true
        }

        if (start && end && +start < +value && +value < +end && !this.isEqualDate(value, start) && !this.isEqualDate(value, end)) {
          result.isRange = true
        }
      }

      return result
    },
    isEqualDate (date1, date2) {
      return date1.getFullYear() === date2.getFullYear()
          && date1.getMonth() === date2.getMonth()
          && date1.getDate() === date2.getDate()
    },
    isToday (date) {
      const today = new Date()
      return this.isEqualDate(date, today)
    },
    isCurrentDate (date) {
      const curDate = this.model
      return this.isEqualDate(date, curDate)
    },
    showYearPanel () {
      this.$emit('showYearPanel')
    },
    showMonthPanel () {
      this.$emit('showMonthPanel')
    },
    isActiveDay (day) {
      return day.isCurrentMonth && (this.range == null && day.isCurrentDate || day.isRangeStart || day.isRangeEnd)
    },
    isRangeDay (day) {
      if (this.range) {
        const start = this.range[0]
        const end = this.range[1]
        var isMouseOverRange = false

        if (start != null && end == null) {
          if (start < day.value && !this.isEqualDate(start, day.value)
              && day.value < this.mouseoverValue && !this.isEqualDate(day.value, this.mouseoverValue)) {
            isMouseOverRange = true
          }
        }
      }

      return day.isCurrentMonth && (day.isRange || isMouseOverRange)
    }
  },
  watch: {
    value (value) {
      if (this.range) {
        return
      }
      this.tempValue = new Date(value)
    }
  }
})


export default AuDatePickerContent
