"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface GridItemProps {
	id: string;
	children: React.ReactNode;
}

export const GridItem: React.FC<GridItemProps> = ({ id, children }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children}
		</div>
	);
};

interface GridProps {
	items: { id: string; content: string }[];
	sortable: boolean;
	onSortEnd?: (items: { id: string; content: string }[]) => void;
	children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({
	items,
	sortable,
	onSortEnd,
	children,
}) => {
	const [currentItems, setCurrentItems] = React.useState(items);

	const handleDragEnd = (event: any) => {
		const { active, over } = event;

		if (active.id !== over.id) {
			const oldIndex = currentItems.findIndex((item) => item.id === active.id);
			const newIndex = currentItems.findIndex((item) => item.id === over.id);
			const newItems = arrayMove(currentItems, oldIndex, newIndex);

			setCurrentItems(newItems);
			if (onSortEnd) {
				onSortEnd(newItems);
			}
		}
	};

	return (
		<DndContext
			onDragEnd={sortable ? handleDragEnd : undefined}
			collisionDetection={closestCenter}
		>
			<SortableContext
				items={currentItems.map((item) => item.id)}
				strategy={rectSortingStrategy}
			>
				<div className="grid grid-cols-1 gap-4">{children}</div>
			</SortableContext>
		</DndContext>
	);
};
