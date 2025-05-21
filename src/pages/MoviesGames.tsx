import { useState } from "react";
import { useMovieGameItems, useDeleteMovieGameItem, MovieGameItem } from "@/hooks/use-movies-games";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddMovieGameItemForm from "@/components/AddMovieGameItemForm";
import EditMovieGameItemForm from "@/components/EditMovieGameItemForm";
import { Trash2, Pencil } from "lucide-react";

const MoviesGames = () => {
  const { data: movieGameItems, isLoading, error, refetch } = useMovieGameItems();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MovieGameItem | null>(null);

  const handleItemAdded = () => {
    refetch();
    setIsAddDialogOpen(false);
  };

  const handleItemEdited = () => {
    refetch();
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  const deleteItemMutation = useDeleteMovieGameItem();

  const handleDelete = (item: MovieGameItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItemMutation.mutate(item.id);
    }
  };

  const handleEdit = (item: MovieGameItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Movies & Games</h1>
        <Skeleton className="w-full h-[300px] rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Movies & Games</h1>
        <p className="text-red-500">Error loading items: {error.message}</p>
      </div>
    );
  }

  // Filter items into Games and Movies
  const gameItems = movieGameItems?.filter(item => item.type === 'Game') || [];
  const movieItems = movieGameItems?.filter(item => item.type === 'VHS' || item.type === 'DVD') || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-emerald-600">Bear Paw Movies & Games</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-800 hover:bg-amber-900 text-primary-foreground">Add Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Movie or Game</DialogTitle>
            </DialogHeader>
            <AddMovieGameItemForm onSuccess={handleItemAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      {selectedItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Movie or Game</DialogTitle>
            </DialogHeader>
            <EditMovieGameItemForm item={selectedItem} onSuccess={handleItemEdited} />
          </DialogContent>
        </Dialog>
      )}

      {/* Games Table */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Games</h2>
      {gameItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead># of Players</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gameItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.players ?? '-'}</TableCell>
                <TableCell className="text-right flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item)}
                    disabled={deleteItemMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No games found. Add some!</p>
      )}

      {/* Movies Table */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Movies</h2>
      {movieItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Format</TableHead> {/* Changed header */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movieItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell> {/* Display VHS/DVD */}
                <TableCell className="text-right flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item)}
                    disabled={deleteItemMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No movies found. Add some!</p>
      )}
    </div>
  );
};

export default MoviesGames;