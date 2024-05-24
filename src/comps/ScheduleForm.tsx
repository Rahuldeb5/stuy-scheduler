import { Component, FC, useState, ChangeEvent } from 'react';
import { Periods } from "../context/ScheduleContext";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Alert,
    Box,
    Button,
    IconButton,
    Snackbar,
    TextField,
    Tooltip
} from "@mui/material";
import { AddCircle, Clear } from "@mui/icons-material";

class ScheduleForm extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            format: "AndyFin",
            name: "Regular",
            days: [{
                day: "",
                block: "A",
                testing: "Science Testing",
                announcement: null,
                bell: {
                    scheduleType: "regular",
                    scheduleName: "Regular Schedule",
                    schedule: [{
                        name: "Period 1",
                        startTime: "08:00",
                        duration: 41
                    }] as Periods,
                }
            }],
            output: "",
            toastOpen: false
        };
    }

    appendPeriod(dayIndex: number, name: string, startTime: string, duration: number) {
        const days = [...this.state.days];
        days[dayIndex].bell.schedule.push({ name, startTime, duration });
        this.setState({ days });
    }

    editPeriod(dayIndex: number, periodIndex: number, name: string, startTime: string, duration: number) {
        const days = [...this.state.days];
        days[dayIndex].bell.schedule[periodIndex] = { name, startTime, duration };
        this.setState({ days });
    }

    updatePName(dayIndex: number, periodIndex: number, name: string) {
        const period = this.state.days[dayIndex].bell.schedule[periodIndex];
        this.editPeriod(dayIndex, periodIndex, name, period.startTime, period.duration);
    }

    updatePStart(dayIndex: number, periodIndex: number, startTime: string) {
        const period = this.state.days[dayIndex].bell.schedule[periodIndex];
        this.editPeriod(dayIndex, periodIndex, period.name, startTime, period.duration);
    }

    updatePDuration(dayIndex: number, periodIndex: number, duration: number) {
        const period = this.state.days[dayIndex].bell.schedule[periodIndex];
        this.editPeriod(dayIndex, periodIndex, period.name, period.startTime, duration);
    }

    removePeriod(dayIndex: number, periodIndex: number) {
        const days = [...this.state.days];
        if (days[dayIndex].bell.schedule.length === 1) return;
        days[dayIndex].bell.schedule.splice(periodIndex, 1);
        this.setState({ days });
    }

    appendDay() {
        this.setState({
            days: [...this.state.days, {
                day: "",
                block: "A",
                testing: "Science Testing",
                announcement: null,
                bell: {
                    scheduleType: "regular",
                    scheduleName: "Regular Schedule",
                    schedule: [{
                        name: "Period 1",
                        startTime: "08:00",
                        duration: 41
                    }]
                }
            }]
        });
    }

    removeDay(index: number) {
        const days = [...this.state.days];
        if (days.length === 1) return;
        days.splice(index, 1);
        this.setState({ days });
    }

    generate(days: any): string {
        return JSON.stringify({ scheduleType: "week", days }, null, 2);
    }

    ScheduleCell: FC<{ dayIndex: number, periodIndex: number }> = (props) => {
        const period = this.state.days[props.dayIndex].bell.schedule[props.periodIndex];
        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: '2.5rem'
            }}>
                <TextField
                    label="Period"
                    variant="filled"
                    value={period.name}
                    onChange={event => {
                        this.updatePName(props.dayIndex, props.periodIndex, event.target.value);
                    }}
                />
                <TextField
                    label="Start Time"
                    variant="filled"
                    value={period.startTime}
                    onChange={event => {
                        this.updatePStart(props.dayIndex, props.periodIndex, event.target.value);
                    }}
                />
                <TextField
                    label="Duration"
                    variant="filled"
                    type="number"
                    value={period.duration}
                    onChange={event => {
                        this.updatePDuration(props.dayIndex, props.periodIndex, parseInt(event.target.value));
                    }}
                />
                <IconButton
                    aria-label={`remove ${period.name}`}
                    disabled={this.state.days[props.dayIndex].bell.schedule.length === 1}
                    onClick={() => this.removePeriod(props.dayIndex, props.periodIndex)}
                >
                    <Clear />
                </IconButton>
            </Box>
        );
    };

    render() {
        const toggleClose = () => this.setState({ toastOpen: !this.state.toastOpen });
        return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                {this.state.days.map((day: any, dayIndex: number) => (
                    <Box key={dayIndex} sx={{ marginBottom: '2rem' }}>
                        <TextField
                            label="Day"
                            value={day.day}
                            onChange={event => {
                                const days = [...this.state.days];
                                days[dayIndex].day = event.target.value;
                                this.setState({ days });
                            }}
                        />
                        <TextField
                            label="Schedule Type"
                            variant="outlined"
                            value={day.bell.scheduleType}
                            onChange={event => {
                                const days = [...this.state.days];
                                days[dayIndex].bell.scheduleType = event.target.value;
                                this.setState({ days });
                            }}
                        />
                        <TextField
                            label="Schedule Name"
                            variant="outlined"
                            disabled={this.state.format !== "AndyFin"}
                            onChange={event => {
                                const days = [...this.state.days];
                                days[dayIndex].bell.scheduleName = event.target.value;
                                this.setState({ days });
                            }}
                            value={day.bell.scheduleName}
                        />
                        {day.bell.schedule.map((cell: any, periodIndex: number) =>
                            <this.ScheduleCell key={periodIndex} dayIndex={dayIndex} periodIndex={periodIndex} />
                        )}
                        <Tooltip title={"Add a period"}>
                            <IconButton
                                sx={{ marginBottom: '1rem' }}
                                size="large"
                                aria-label="add a period"
                                onClick={() => this.appendPeriod(
                                    dayIndex,
                                    "Period X",
                                    day.bell.schedule[day.bell.schedule.length - 1].startTime,
                                    day.bell.schedule[day.bell.schedule.length - 1].duration
                                )}
                            >
                                <AddCircle fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Remove this day"}>
                            <IconButton
                                sx={{ marginBottom: '1rem' }}
                                size="large"
                                aria-label="remove this day"
                                onClick={() => this.removeDay(dayIndex)}
                            >
                                <Clear fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                        <TextField
                            label="Block"
                            variant="outlined"
                            value={day.block}
                            onChange={event => {
                                const days = [...this.state.days];
                                days[dayIndex].block = event.target.value;
                                this.setState({ days });
                            }}
                        />
                        <TextField
                            label="Testing"
                            variant="outlined"
                            value={day.testing}
                            onChange={event => {
                                const days = [...this.state.days];
                                days[dayIndex].testing = event.target.value;
                                this.setState({ days });
                            }}
                        />
                        <TextField
                            label="Announcement"
                            variant="outlined"
                            value={day.announcement}
                            onChange={event => {
                                const days = [...this.state.days];
                                days[dayIndex].announcement = event.target.value;
                                this.setState({ days });
                            }}
                        />
                    </Box>
                ))}
                <Tooltip title={"Add a day"}>
                    <IconButton
                        sx={{ marginBottom: '1rem' }}
                        size="large"
                        aria-label="add a day"
                        onClick={() => this.appendDay()}
                    >
                        <AddCircle fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                <Button variant="contained"
                    sx={{ marginBottom: '2rem' }}
                    onClick={async () => {
                        const output = this.generate(this.state.days);
                        this.setState({ output });
                        await navigator.clipboard.writeText(output);
                        toggleClose();
                    }}>
                    Generate
                </Button>
                <Snackbar open={this.state.toastOpen} autoHideDuration={5000} onClose={toggleClose}>
                    <Alert onClose={toggleClose} severity="success">
                        Copied to clipboard!
                    </Alert>
                </Snackbar>
                <code>{this.state.output}</code>
            </LocalizationProvider>
        );
    }
}

export default ScheduleForm;
