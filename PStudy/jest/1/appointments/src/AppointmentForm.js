import React, { useState, useCallback } from 'react';

const TimeSlotTable = ({salonOpensAt,
                           salonClosesAt,
                           today,
                           availableTimeSlots,
                           checkedTimeSlot,
                           handleChange}) => {
    const dates = weeklyDateValues(today);
    const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
    return (
        <table id="time-slots">
            <thead>
            <tr>
                <th />
                {dates.map(d => (
                    <th key={d}>{toShortDate(d)}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {timeSlots.map(timeSlot =>
                <tr key={timeSlot}>
                    <th>{toTimeValue(timeSlot)}</th>
                    {dates.map(date =>
                        <td key={date}>
                            <RadioButtonIfAvailable
                                availableTimeSlots={availableTimeSlots}
                                date={date}
                                timeSlot={timeSlot}
                                checkedTimeSlot={checkedTimeSlot}
                                handleChange={handleChange}
                            />
                        </td>
                    )}
                </tr>
            )}
            </tbody>
        </table>
    );
};

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
    const totalSlots = (salonClosesAt - salonOpensAt) * 2;
    const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
    const increment = 30 * 60 * 1000;
    return Array(totalSlots)
        .fill([startTime])
        .reduce((acc, _, i) =>
            acc.concat([startTime + (i * increment)])
        );
};

const weeklyDateValues = (startDate) => {
    const midnight = new Date(startDate).setHours(0, 0, 0, 0);
    const increment = 24 * 60 * 60 * 1000;
    return Array(7)
        .fill([midnight])
        .reduce((acc, _, i) => acc.concat([midnight + (i * increment)]));
};

const toShortDate = timestamp => {
    const [day, , dayOfMonth] = new Date(timestamp)
        .toDateString()
        .split(' ');
    return `${day} ${dayOfMonth}`;
};

const timeIncrements = (numTimes, startTime, increment) =>
    Array(numTimes)
        .fill([startTime])
        .reduce((acc, _, i) => acc.concat([startTime + (i * increment)]));

const toTimeValue = timestamp => new Date(timestamp).toTimeString().substring(0, 5);

const mergeDateAndTime = (date, timeSlot) => {
    const time = new Date(timeSlot);
    return new Date(date).setHours(
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds()
    );
};

const RadioButtonIfAvailable = ({availableTimeSlots,
                                    date,
                                    timeSlot,
                                    checkedTimeSlot,
                                    handleChange
    }) => {
    const startsAt = mergeDateAndTime(date, timeSlot);
    if (availableTimeSlots.some(availableTimeSlot => availableTimeSlot.startsAt === startsAt)) {
        const isChecked = startsAt === checkedTimeSlot;
        return (
            <input
                name="startsAt"
                type="radio"
                value={startsAt}
                checked={isChecked}
                onChange={handleChange}
            />
        )
    }
    return null;
};

export const AppointmentForm = ({ selectableServices,
                                    service,
                                    salonOpensAt,
                                    salonClosesAt,
                                    today,
                                    availableTimeSlots}) => {
    const [appointment, setAppointment] = useState({
        service,
        // startsAt,
        // stylist
    });

    const handleStartsAtChange = useCallback(
        ({ target: { value } }) =>
            setAppointment(appointment => ({
                ...appointment,
                startsAt: parseInt(value)
            })),
        []
    );

    return (
    <form id="appointment">
        <select name="service" id="service" value={service}>
            <option />
            {selectableServices.map(s => (
                <option key={s}>{s}</option>
            ))}
        </select>
        <TimeSlotTable
            salonOpensAt={salonOpensAt}
            salonClosesAt={salonClosesAt}
            today={today}
            availableTimeSlots={availableTimeSlots}
            checkedTimeSlot={appointment.startsAt}
            handleChange={handleStartsAtChange}
        />
    </form>
)};

AppointmentForm.defaultProps = {    // 디폴트 값 설정
    availableTimeSlots: [],
    today: new Date(),
    salonOpensAt: 9,
    salonClosesAt: 19,
    selectableServices: [
        'Cut',
        'Blow-dry',
        'Cut & color',
        'Beard trim',
        'Cut & beard trim',
        'Extensions']
};
