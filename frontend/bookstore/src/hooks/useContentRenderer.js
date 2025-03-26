import { useCallback } from "react";
import {
    LoadingSpinner,
    ErrorMessage,
    EmptyState as DefaultEmptyState,
} from "../components/LoadingStates";

const useContentRenderer = () => {
    const renderContent = useCallback(
        ({
            isLoading,
            error,
            content,
            loadingMessage = "Loading...",
            errorMessage = "An error occurred.",
            EmptyState = DefaultEmptyState,
        }) => {
            if (isLoading) return <LoadingSpinner message={loadingMessage} />;
            if (error) return <ErrorMessage message={errorMessage} details={error} />;
            if (!content || (Array.isArray(content) && content.length === 0)) {
                return EmptyState ? <EmptyState /> : null;
            }

            return content;
        },
        []
    );

    const renderItems = useCallback(
        ({
            isLoading,
            error,
            items,
            renderItem,
            LoadingState = () => <LoadingSpinner message="Loading items..." />,
            ErrorState = ({ error }) => (
                <ErrorMessage message="Error loading items" details={error} />
            ),
            EmptyState = () => <DefaultEmptyState message="No items found" />,
        }) => {
            if (isLoading) return <LoadingState />;
            if (error) return <ErrorState error={error} />;
            if (!items || items.length === 0) return <EmptyState />;

            return items.map(renderItem);
        },
        []
    );

    const renderContentState = renderContent;

    return {
        renderContent,
        renderItems,
        renderContentState,
    };
};

export default useContentRenderer;
