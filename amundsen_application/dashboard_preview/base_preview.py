from abc import ABCMeta, abstractmethod


class BasePreview(metaclass=ABCMeta):
    """
    A Preview interface for other product to implement. For example, see ModePreview.
    """

    @abstractmethod
    def get_preview_image(self, *, uri) -> bytes:
        """
        Returns image bytes given URI
        :param uri:
        :return:
        """
        pass
