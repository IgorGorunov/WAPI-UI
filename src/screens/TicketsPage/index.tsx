import React, { useState, useEffect, useCallback } from "react";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
// import styles from "./styles.module.scss";
import Button from "@/components/Button/Button";
import { getLastFewDays } from "@/utils/date";
import Loader from "@/components/Loader";
import { useMarkNotificationAsRead } from "@/hooks/useMarkNotificationAsRead";
import TicketList from "./components/TicketList";
import Ticket from "./components/Ticket";
import { TicketType } from "@/types/tickets";
import useTourGuide from "@/context/tourGuideContext";
import { TourGuidePages } from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {
    tourGuideStepsTickets,
    tourGuideStepsTicketsNoDocs
} from "./ticketsTourGuideSteps.constants";
import { sendUserBrowserInfo } from "@/services/userInfo";
import { STATUS_MODAL_TYPES } from "@/types/utility";
import ModalStatus, { ModalStatusType } from "@/components/ModalStatus";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import { usePagedListState, usePagedData, useFilterMetadata } from "@/components/PagedList";
import { TicketsFilters, TicketFilterDataType } from "./types";

const TicketsPage = () => {
    const { tenantData: { alias } } = useTenant();
    const { token, ui, getBrowserInfo, isActionIsAccessible } = useAuth();
    const Router = useRouter();
    const query = Router.query;

    useEffect(() => {
        const { uuid } = query;

        if (uuid) {
            handleEditTicket(Array.isArray(uuid) ? uuid[0] : uuid);
            delete query.uuid;
            Router.replace({ pathname: '/tickets', query: { ...query } }, undefined, { shallow: true });
        }
    }, [query]);

    // universal state management via url
    const { state, updatePeriod, updateFilters, updateSearch, updatePage, updatePageSize, updateSort, clearAllFilters } = usePagedListState<TicketsFilters>(
        {} as Partial<TicketsFilters>,
        {
            defaultPageSize: 10,
            defaultDateRange: { startDate: getLastFewDays(new Date(), 30), endDate: new Date() },
            defaultSortBy: 'date',
            defaultSortOrder: 'desc',
        }
    );

    // fetch paginated tickets
    const { data: ticketsData, count: totalTickets, isLoading: isLoadingTickets, refetch: refetchTickets } = usePagedData<TicketType>(
        '/GetPagedTicketList',
        state,
        {
            token,
            alias,
            ui,
            enabled: !!token && isActionIsAccessible(AccessObjectTypes.Tickets, AccessActions.ListView),
        }
    );

    // fetch filter metadata
    const { metadata: filterMetadata, isLoading: isLoadingFilters } = useFilterMetadata<TicketFilterDataType>(
        '/GetPagedFiltersTicketList',
        { startDate: state.startDate, endDate: state.endDate },
        { token, alias, ui, enabled: !!token }
    );

    const isLoading = isLoadingTickets || isLoadingFilters;

    const [singleTicketUuid, setSingleTicketUuid] = useState<string | null>(null);
    const [isTicketNew, setIsTicketNew] = useState(true);

    const { setDocNotificationsAsRead } = useMarkNotificationAsRead();

    // modal
    const [showTicketModal, setShowTicketModal] = useState(false);
    const handleTicketModalClose = () => {
        setShowTicketModal(false);

        if (singleTicketUuid) {
            setDocNotificationsAsRead(singleTicketUuid);
        }
        refetchTickets();
    }

    // status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    const closeErrorModal = useCallback(() => {
        setShowStatusModal(false);
    }, [])

    const handleEditTicket = async (uuid: string) => {
        setIsTicketNew(false);
        setSingleTicketUuid(uuid)

        if (!isActionIsAccessible(AccessObjectTypes.Tickets, AccessActions.ViewObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('ViewEditTicket', AccessObjectTypes.Tickets, AccessActions.ViewObject), body: { uuid: uuid } });
            } catch { }

            setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal })
            setShowStatusModal(true);
        } else {
            setShowTicketModal(true);
        }
    }

    const handleCreateTicket = () => {
        setIsTicketNew(true);
        setSingleTicketUuid(null);

        if (!isActionIsAccessible(AccessObjectTypes.Tickets, AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CreateTicket', AccessObjectTypes.Tickets, AccessActions.CreateObject), body: {} });
            } catch { }
        } else {
            setShowTicketModal(true);
        }
    }

    const handleRefresh = () => {
        refetchTickets();
    }

    // tour guide
    const { runTour, setRunTour, isTutorialWatched } = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.Tickets)) {
            if (!isLoading && ticketsData && ticketsData.length > 0) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading, ticketsData]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(ticketsData?.length ? tourGuideStepsTickets : tourGuideStepsTicketsNoDocs);
    }, [ticketsData]);

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='Tickets' description={`Our tickets page`} />
            <div className="page-component tickets-page tickets-page__container">
                {isLoading && <Loader />}
                <Header pageTitle='Tickets' toRight needTutorialBtn >
                    <Button classNames='add-ticket' icon="add" iconOnTheRight onClick={handleCreateTicket}>Create ticket</Button>
                </Header>

                {ticketsData && (
                    <TicketList
                        tickets={ticketsData}
                        isLoading={isLoading}
                        totalTickets={totalTickets}
                        filterMetadata={filterMetadata}
                        currentPage={state.page}
                        pageSize={state.limit}
                        searchTerm={state.search}
                        fullTextSearch={state.fullTextSearch}
                        sortBy={state.sortBy}
                        sortOrder={state.sortOrder}
                        selectedFilters={state.filters}
                        onPageChange={updatePage}
                        onPageSizeChange={updatePageSize}
                        onSearchChange={updateSearch}
                        onSortChange={updateSort}
                        onFiltersChange={updateFilters}
                        onClearFilters={clearAllFilters}
                        handleEditTicket={handleEditTicket}
                        handleRefresh={handleRefresh}
                        startDate={state.startDate}
                        endDate={state.endDate}
                        onPeriodChange={updatePeriod}
                    />
                )}
            </div>
            {showTicketModal && (singleTicketUuid || isTicketNew) ?
                <Ticket ticketUuid={singleTicketUuid} onClose={handleTicketModalClose} />
                : null
            }
            {ticketsData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.Tickets} /> : null}
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </Layout>
    )
}

export default TicketsPage;