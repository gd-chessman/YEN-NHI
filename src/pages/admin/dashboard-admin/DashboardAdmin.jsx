import React, {forwardRef, useMemo} from 'react';
import {Box, Paper, Typography, useTheme} from "@mui/material";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import {BarChart} from "echarts/charts";
import {AxisPointerComponent, GridComponent, TooltipComponent} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";
import * as echarts from 'echarts/core';
import Stack from "@mui/material/Stack";
import IconifyIcon from "../../../components/base/IconifyIcon.jsx";

echarts.use([BarChart, TooltipComponent, GridComponent, AxisPointerComponent, CanvasRenderer]);

const ReactEchart = forwardRef((props, ref) => {
    const { option, ...rest } = props;

    return (
        <Box
            component={ReactEChartsCore}
            ref={ref}
            option={{
                ...option,
                tooltip: {
                    ...option.tooltip,
                    confine: true,
                },
            }}
            {...rest}
        />
    );
});

const TotalSpentChart = ({ data, ...rest }) => {
    const theme = useTheme();

    const option = useMemo(() => ({
        tooltip: {
            trigger: 'axis',
            formatter: 'Spent: ${c}',
            axisPointer: {
                type: 'line',
                axis: 'y',
                label: {
                    show: true,
                    formatter: (params) => {
                        return `$${params.value}`;
                    },
                    fontWeight: 500,
                    color: theme.palette.primary.main,
                    fontSize: theme.typography.caption.fontSize,
                    backgroundColor: theme.palette.info.light,
                    padding: [4, 4, 0, 4],
                },
                lineStyle: {
                    type: 'dashed',
                    color: theme.palette.primary.main,
                    width: 1,
                },
            },
        },
        grid: {
            top: '10%',
            left: '0%',
            right: '0%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                data: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ],
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    margin: 15,
                    fontWeight: 500,
                    color: theme.palette.text.disabled,
                    fontSize: theme.typography.caption.fontSize,
                    fontFamily: theme.typography.fontFamily,
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
                min: 100,
                minInterval: 1,
                axisLabel: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
        ],
        series: [
            {
                name: 'Spent',
                type: 'bar',
                barWidth: '60%',
                data,
                itemStyle: {
                    color: theme.palette.info.dark,
                    borderRadius: [10, 10, 10, 10],
                },
                emphasis: {
                    itemStyle: {
                        color: theme.palette.primary.main,
                    },
                },
            },
        ],
    }), [theme, data]);

    return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

const DashboardAdmin = () => {
    return (
        <>
            <Paper sx={{ height: 355 }}>
                <Stack alignItems="flex-start" justifyContent="space-between">
                    <Box>
                        <Typography variant="caption" color="text.disabled" fontWeight={500}>
                            Total Spent
                        </Typography>
                        <Typography variant="h2" color="text.primary" mt={0.25}>
                            $1,247.5
                        </Typography>
                    </Box>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        height={42}
                        width={42}
                        bgcolor="info.main"
                        borderRadius={1.75}
                    >
                        <IconifyIcon icon="ic:round-bar-chart" color="primary.main" fontSize="h3.fontSize" />
                    </Stack>
                </Stack>

                <TotalSpentChart
                    data={[160, 320, 210, 270, 180, 350, 230, 290, 200, 330, 150, 220]}
                    sx={{ height: '230px !important' }}
                />
            </Paper>
            {/*<Box>*/}
            {/*    csaiodj*/}
            {/*</Box>*/}
        </>
    );
};

export default DashboardAdmin;