import styled from "@emotion/styled";
import * as React from "react";
import { useUsersList } from "../domain/useUsersList";
import { EditIcon } from "./icons/EditIcon";
import { Avatar } from "./system/Avatar";
import { Button } from "./system/Button";
import { Card, CardContent, CardSubtitle, CardTitle } from "./system/Card";
import { Input } from "./system/Input";
import { UserEditor } from "./UserEditor";

export const UsersList = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selected, setSelected] = React.useState<{
    id: string;
    name: string;
    address: string | null;
    description: string | null;
  } | null>(null);
  const { users, loadMore, loading, error } = useUsersList(searchTerm);

  const skeletonItems = Array<null>(6).fill(null);
  const items =
    users?.items?.filter((user) => !user || user?.name.includes(searchTerm)) ??
    skeletonItems;

  const handleLoadMore = async () => {
    await loadMore();
    scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <>
      <Header>
        <h1>Users list</h1>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>
      <Grid>
        {items.map((item, i) => (
          <UserCard key={item?.id ?? i} onClick={() => setSelected(item)}>
            <CardIcon />
            <Avatar
              src={
                item?.id
                  ? `https://source.unsplash.com/126x126/?portrait,${item.id}`
                  : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              }
            />
            <CardContent>
              <CardTitle>{item?.name}</CardTitle>
              <CardSubtitle>{item?.description}</CardSubtitle>
            </CardContent>
          </UserCard>
        ))}
      </Grid>
      <Button
        onClick={handleLoadMore}
        disabled={loading}
        $error={Boolean(error)}
      >
        {loading ? "Loading..." : "Load more"}
      </Button>
      {selected && (
        <UserEditor
          key={selected.id}
          user={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

const Header = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  justify-content: space-between;
`;

const Grid = styled.div`
  align-self: stretch;
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fill, minmax(25rem, auto));
  justify-content: center;
  margin: 5rem 0;
`;

const CardIcon = styled(EditIcon)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;

const UserCard = styled(Card)`
  position: relative;
  :hover,
  :focus {
    svg {
      opacity: 1;
    }
  }
`;
