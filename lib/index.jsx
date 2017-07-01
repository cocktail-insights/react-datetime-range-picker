/* eslint 'react/sort-comp': off, 'react/jsx-no-bind': off */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Datetime from 'react-datetime';

// import style
import './style.css';

class DatetimeRangePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      end: moment(),
      start: moment(),
    };
  }

  getInputProps() {
    const inputReadOnlyStyle = {
      cursor: 'pointer',
      backgroundColor: 'white',
      border: '1px solid #e2e2e2',
    };

    return this.props.input
      ? this.props.inputProps
      : {
        input: true,
        inputProps: {
          ...this.props.inputProps,     // merge inputProps with default
          readOnly: true,
          style: inputReadOnlyStyle,
        },
      };
  }

  propsToPass() {
    return {
      end: this.state.end.toDate(),
      start: this.state.start.toDate(),
    };
  }

  calcBaseProps() {
    return {
      utc: this.props.utc,
      locale: this.props.locale,
      input: !this.props.inline,
      viewMode: this.props.viewMode,
      dateFormat: this.props.dateFormat,
      timeFormat: this.props.timeFormat,
      closeOnTab: this.props.closeOnTab,
      className: this.props.pickerClassName,
      closeOnSelect: this.props.closeOnSelect,
    };
  }


  calcStartTimeProps() {
    const baseProps = this.calcBaseProps();
    const inputProps = this.getInputProps();

    return {
      ...baseProps,
      ...inputProps,
      defaultValue: this.props.startDate,
      onBlur: this.props.onStartDateBlur,
      onFocus: this.props.onStartDateFocus,
      timeConstraints: this.props.startTimeConstraints,
    };
  }

  calcEndTimeProps() {
    const baseProps = this.calcBaseProps();
    const inputProps = this.getInputProps();

    return {
      ...baseProps,
      ...inputProps,
      onBlur: this.props.onEndDateBlur,
      defaultValue: this.props.endDate,
      onFocus: this.props.onEndDateFocus,
      timeConstraints: this.props.endTimeConstraints,
    };
  }

  validateMinDate(date) {
    return this.state.start.isSameOrBefore(date, 'day');
  }

  isValidEndDate(date) {
    return this.validateMinDate(date) && this.props.isValidEndDate(date);
  }

  onStartDateChange(date) {
    this.setState({ start: date }, () => {
      this.props.onChange(this.propsToPass());
      this.props.onStartDateChange(this.propsToPass().start);
    });
  }

  onEndDateChange(date) {
    this.setState({ end: date }, () => {
      this.props.onChange(this.propsToPass());
      this.props.onEndDateChange(this.propsToPass().end);
    });
  }

  onFocus() {
    this.props.onFocus();
  }

  onBlur() {
    this.props.onBlur(this.propsToPass());
  }

  renderDay(props, currentDate) {
    const { start, end } = this.state;
    const { className, ...rest } = props;
    const date = moment(props.key, 'M_D');

    // style all dates in range
    let classes = date.isBetween(start, end, 'day')
      ? `${props.className} in-selecting-range` : props.className;

    // add rdtActive to selected startdate in enddate picker
    classes = date.isSame(start, 'day') ? `${classes} rdtActive` : classes;

    return (
      <td {...rest}
        className={classes}>
        {currentDate.date()}
      </td>
    );
  }
  render() {
    const startProps = this.calcStartTimeProps();
    const endProps = this.calcEndTimeProps();

    return (
      <div
        className={this.props.className}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}>
        <Datetime
          {...startProps}
          isValidDate={this.props.isValidStartDate}
          onChange={this.onStartDateChange.bind(this)}
          renderDay={this.renderDay.bind(this)} />

        <Datetime
          {...endProps}
          isValidDate={this.isValidEndDate.bind(this)}
          onChange={this.onEndDateChange.bind(this)}
          renderDay={this.renderDay.bind(this)} />
      </div>
    );
  }
}

DatetimeRangePicker.defaultProps = {
  utc: false,
  locale: null,
  input: false,   // This defines whether or not to to edit date manually via input
  inline: false,  // This defines whether or not to show input field
  className: '',
  viewMode: 'days',
  dateFormat: true,
  timeFormat: true,
  closeOnTab: true,
  onBlur: () => {},
  onFocus: () => {},
  onChange: () => {},
  pickerClassName: '',
  endDate: new Date(),
  closeOnSelect: false,
  inputProps: undefined,
  startDate: new Date(),
  onEndDateBlur: () => {},
  endTimeConstraints: null,
  onEndDateFocus: () => {},
  isValidStartDate: () => true,
  isValidEndDate: () => true,
  onStartDateBlur: () => {},
  onEndDateChange: () => {},    // This is called after onChange
  onStartDateFocus: () => {},
  startTimeConstraints: null,
  onStartDateChange: () => {},  // This is called after onChange
};


DatetimeRangePicker.propTypes = {
  utc: PropTypes.bool,
  input: PropTypes.bool,
  inline: PropTypes.bool,
  onBlur: PropTypes.bool,
  onFocus: PropTypes.func,
  locale: PropTypes.string,
  onChange: PropTypes.func,
  viewMode: PropTypes.string,
  closeOnTab: PropTypes.bool,
  className: PropTypes.string,
  inputProps: PropTypes.object,   // eslint-disable-line
  closeOnSelect: PropTypes.bool,
  isValidEndDate: PropTypes.func,
  onEndDateBlur: PropTypes.func,
  onEndDateFocus: PropTypes.func,
  onEndDateChange: PropTypes.func,
  onStartDateBlur: PropTypes.func,
  isValidStartDate: PropTypes.func,
  onStartDateFocus: PropTypes.func,
  onStartDateChange: PropTypes.func,
  pickerClassName: PropTypes.string,
  endDate: PropTypes.instanceOf(Date),
  endTimeConstraints: PropTypes.object,   // eslint-disable-line
  startDate: PropTypes.instanceOf(Date),
  startTimeConstraints: PropTypes.object,   // eslint-disable-line
  dateFormat: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  timeFormat: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default DatetimeRangePicker;
