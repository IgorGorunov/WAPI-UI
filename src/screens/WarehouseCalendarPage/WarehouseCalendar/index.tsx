import React, {useRef, useMemo, useEffect, useState, useCallback, useLayoutEffect} from 'react';
import {
    format,
    isWeekend,
    addDays,
    subDays,
    startOfToday,
    eachDayOfInterval,
    isSameDay,
    parseISO,
    addMonths,
    startOfMonth,
    subMonths
} from 'date-fns';
import styles from './styles.module.scss';
import { WarehouseCalendarType } from "@/types/warehouseCalendar";
import Icon from "@/components/Icon";

const WarehouseCalendar = ({ warehouses }: { warehouses: WarehouseCalendarType[] }) => {
    const [range, setRange] = useState({ start: 30, end: 90 });
    const [pendingScrollDate, setPendingScrollDate] = useState<Date | null>(null);
    const [currentLabel, setCurrentLabel] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const today = startOfToday();

    // 1. Initial Positioning
    useLayoutEffect(() => {
        const container = scrollRef.current;
        const todayElement = document.getElementById('is-today');
        if (container && todayElement) {
            const containerWidth = container.offsetWidth;
            const elementOffset = todayElement.offsetLeft;
            const elementWidth = todayElement.offsetWidth;
            container.scrollLeft = elementOffset - (containerWidth / 2) + (elementWidth / 2);
        }
    }, []);

    const days = useMemo(() => {
        return eachDayOfInterval({
            start: subDays(today, range.start),
            end: addDays(today, range.end),
        });
    }, [range, today]);

    useEffect(() => {
        if (pendingScrollDate && scrollRef.current) {
            // Look for the date now that the range has updated
            const targetIndex = days.findIndex(d => isSameDay(d, pendingScrollDate));

            if (targetIndex !== -1) {
                scrollRef.current.scrollTo({
                    left: targetIndex * 80,
                    behavior: 'smooth'
                });
                // Clear the pending scroll so it doesn't trigger again
                setPendingScrollDate(null);
            }
        }
    }, [days, pendingScrollDate]);

    // 2. Update Month Label based on current center-view
    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        // Label Logic: find the day in the center of the scroll view
        const centerPoint = el.scrollLeft + (el.clientWidth / 2);
        const dayIndex = Math.floor(centerPoint / 80);
        if (days[dayIndex]) {
            const label = format(days[dayIndex], 'MMMM yyyy');
            if (label !== currentLabel) setCurrentLabel(label);
        }

        // Infinite Scroll Logic
        const scrollThreshold = 400;
        if (el.scrollWidth - (el.scrollLeft + el.clientWidth) < scrollThreshold) {
            setRange(prev => ({ ...prev, end: prev.end + 30 }));
        }
        if (el.scrollLeft < scrollThreshold) {
            const prevWidth = el.scrollWidth;
            setRange(prev => ({ ...prev, start: prev.start + 30 }));
            setTimeout(() => {
                el.scrollLeft += (el.scrollWidth - prevWidth);
            }, 0);
        }
    }, [days, currentLabel]);

    // 3. Button Navigation (Shift by approx 30 days)
    const shiftMonth = (direction: 'prev' | 'next') => {
        const el = scrollRef.current;
        if (!el) return;

        const centerPoint = el.scrollLeft + (el.clientWidth / 2);
        const dayIndex = Math.floor(centerPoint / 80);
        const currentActiveDate = days[dayIndex];
        if (!currentActiveDate) return;

        const targetMonth = direction === 'next'
            ? addMonths(startOfMonth(currentActiveDate), 1)
            : subMonths(startOfMonth(currentActiveDate), 1);

        const targetIndex = days.findIndex(d => isSameDay(d, targetMonth));

        if (targetIndex !== -1) {
            // date exists, scroll
            el.scrollTo({ left: targetIndex * 80, behavior: 'smooth' });
        } else {
            setPendingScrollDate(targetMonth);
            if (direction === 'next') {
                setRange(prev => ({ ...prev, end: prev.end + 90 }));
            } else {
                setRange(prev => ({ ...prev, start: prev.start + 90 }));
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const slider = scrollRef.current;
        if (!slider) return;
        const startX = e.pageX - slider.offsetLeft;
        const scrollLeft = slider.scrollLeft;

        const onMouseMove = (ev: MouseEvent) => {
            const x = ev.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            slider.scrollLeft = scrollLeft - walk;
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.navHeader}>
                <div className={styles.monthNav}>
                    <button onClick={() => shiftMonth('prev')} className={`${styles.navBtn} ${styles.navBtnLeft}`}><Icon name="keyboard-arrow-right"/></button>

                    <span key={currentLabel} className={styles.currentMonth}>
                        {currentLabel}
                    </span>

                    <button onClick={() => shiftMonth('next')} className={`${styles.navBtn}`}><Icon name="keyboard-arrow-right"/></button>
                </div>
                <button
                    className={styles.todayBtn}
                    onClick={() => document.getElementById('is-today')?.scrollIntoView({ behavior: 'smooth', inline: 'center' })}
                >
                    <span className={styles.btnLabelDesktopOnly}>Back to </span>Today
                </button>
            </div>

            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <div className={styles.cornerHeader}>Warehouse</div>
                    {warehouses.map(wh => (
                        <div key={wh.id} className={styles.sidebarName}>
                            <div className={styles.warehousName}>{wh.warehouse}</div>
                            <div className={styles.warehousInfo}>{`${wh.workingTime} (${wh.timeZone > 0 ? '+' : '-'}${wh.timeZone} GMT`})</div>
                        </div>
                    ))}
                </div>

                <div
                    className={styles.timeline}
                    ref={scrollRef}
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                >
                    <div className={styles.grid} style={{ width: days.length * 80 }}>
                        {days.map(day => (
                            <DayColumn key={day.toISOString()} day={day} warehouses={warehouses} today={today} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DayColumn = React.memo(({ day, warehouses, today }: { day: Date, warehouses: WarehouseCalendarType[], today: Date }) => {
    const isToday = isSameDay(day, today);
    return (
        <div className={`${styles.column} ${isToday ? styles['isToday'] : ''}`} id={isToday ? 'is-today' : undefined}>
            <div className={`${styles.dateHeader} ${isToday ? styles.isTodayActive : ''}`}>
                <span className={styles.dayLabel}>{format(day, 'EEE')}</span>
                <span className={styles.dateLabel}>{format(day, 'dd.MM')}</span>
            </div>
            {warehouses.map(wh => {
                const isClosed = wh.days.some(d => isSameDay(parseISO(d), day));
                return (
                    <div
                        key={wh.id}
                        className={`${styles.cell} ${isToday ? styles.isTodayDay : ''} ${isWeekend(day) ? styles.isWeekend : ''} ${isClosed ? styles.isClosed : ''}`}
                    >
                        {isClosed ? 'Closed' : ''}
                    </div>
                );
            })}
        </div>
    );
});

export default WarehouseCalendar;