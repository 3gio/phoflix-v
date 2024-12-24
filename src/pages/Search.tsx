import { Alert, Box, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import { searchMovie } from "../redux/asyncThunk/moviesThunk";
import MovieList from "../components/movie/MovieList";
import BreadcrumbsCustom from "../components/BreadcrumbsCustom";
import SkeletonPage from "../components/common/SkeletonPage";
import SearchIcon from "@mui/icons-material/Search";
import searchNotFoundImg from "../images/search-not-found.png";
import { scrollToTop } from "../utils";
import _Pagination from "../components/common/_Pagination";

const Search = () => {
  const dispatch: AppDispatch = useDispatch();
  const movies = useSelector(
    (state: RootState) => state.movies.searchMovie.items
  );
  const totalItems = useSelector(
    (state: RootState) => state.movies.searchMovie.pagination.totalItems
  );
  const totalPages = useSelector(
    (state: RootState) => state.movies.searchMovie.pagination.totalPages
  );
  const titleHead = useSelector(
    (state: RootState) => state.movies.searchMovie.titleHead
  );
  const isMobile = useSelector((state: RootState) => state.system.isMobile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const params = useParams();
  const breadcrumbsPaths = ["Tìm kiếm", params.keyword as string];

  // Cập nhật tiêu đề trang
  useEffect(() => {
    document.title = titleHead || "Kết quả tìm kiếm";
  }, [titleHead]);

  // Xử lý thay đổi trang
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    scrollToTop();
  };

  // Gọi API khi thay đổi từ khoá hoặc trang
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      await dispatch(
        searchMovie({
          keyword: params.keyword as string,
          page: currentPage,
        })
      );
      setIsLoading(false);
    };
    fetchMovies();
  }, [params?.keyword, currentPage);

  // Reset về trang đầu khi thay đổi từ khoá
  useEffect(() => {
    setCurrentPage(1);
  }, [params]);

  if (isLoading) {
    return <SkeletonPage page="search" />;
  }

  return (
    <>
      <BreadcrumbsCustom paths={breadcrumbsPaths} />
      <Box
        sx={{
          display: "flex",
          gap: "24px",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Alert
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
          color="neutral"
        >
          <Typography
            startDecorator={<SearchIcon />}
            level={isMobile ? "title-sm" : "title-md"}
          >
            {movies.length > 0
              ? `Tìm thấy ${totalItems} bộ phim phù hợp với từ khoá "${params.keyword}"`
              : `Không tìm thấy phim phù hợp với từ khoá "${params.keyword}"!`}
          </Typography>

          {movies.length > 0 && (
            <Typography color="neutral" level="title-sm">
              {`Trang ${currentPage}`}
            </Typography>
          )}
        </Alert>

        {movies.length > 0 ? (
          <>
            <MovieList movies={movies} />
            <_Pagination
              handleChange={handleChange}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </>
        ) : (
            <Box
              sx={{
                width: "128px",
                height: "128px",
                backgroundImage: `url(${searchNotFoundImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Search;
